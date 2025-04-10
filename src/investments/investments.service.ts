import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, userId: string): Promise<Investment> {
    const project = await this.projectsRepository.findOne({
      where: { id: createInvestmentDto.projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${createInvestmentDto.projectId} not found`);
    }

    if (project.ownerId === userId) {
      throw new ForbiddenException('You cannot invest in your own project');
    }

    const investment = this.investmentsRepository.create({
      ...createInvestmentDto,
      investorId: userId,
    });

    return await this.investmentsRepository.save(investment);
  }

  async findAll(userId: string): Promise<Investment[]> {
    return await this.investmentsRepository.find({
      where: { investorId: userId },
      relations: ['project', 'investor'],
    });
  }

  async findByProject(projectId: string, userId: string): Promise<Investment[]> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('You can only view investments for your own projects');
    }

    return await this.investmentsRepository.find({
      where: { projectId },
      relations: ['investor'],
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const investment = await this.investmentsRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    if (investment.investorId !== userId) {
      throw new ForbiddenException('You can only cancel your own investments');
    }

    await this.investmentsRepository.remove(investment);
  }
} 