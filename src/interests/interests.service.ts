import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateInterestDto } from './dto/create-interest.dto';

@Injectable()
export class InterestsService {
  constructor(
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Interest[]> {
    return await this.interestsRepository.find();
  }

  async findByIds(ids: string[]): Promise<Interest[]> {
    return await this.interestsRepository.findByIds(ids);
  }

  async create(createInterestDto: CreateInterestDto): Promise<Interest> {
    const existingInterest = await this.interestsRepository.findOne({
      where: { name: createInterestDto.name },
    });

    if (existingInterest) {
      throw new ConflictException(`Un intérêt avec le nom "${createInterestDto.name}" existe déjà`);
    }

    const interest = this.interestsRepository.create(createInterestDto);
    return await this.interestsRepository.save(interest);
  }

  async addUserInterests(userId: string, interestIds: string[]): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const interests = await this.interestsRepository.findByIds(interestIds);
    user.interests = interests;

    return await this.usersRepository.save(user);
  }

  async getUserInterests(userId: string): Promise<Interest[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.interests;
  }

  async getRecommendedProjects(userId: string): Promise<Project[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['interests'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.interests || user.interests.length === 0) {
      return [];
    }

    const userInterestIds = user.interests.map(interest => interest.id);

    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoinAndSelect('project.interests', 'interests')
      .where('project.ownerId != :userId', { userId })
      .andWhere('interests.id IN (:...userInterestIds)', { userInterestIds })
      .orderBy('project.createdAt', 'DESC')
      .take(10)
      .getMany();

    return projects;
  }
}
