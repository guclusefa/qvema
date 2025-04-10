import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Interest)
    private interestsRepository: Repository<Interest>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const project = new Project();
    project.title = createProjectDto.title;
    project.description = createProjectDto.description;
    project.budget = createProjectDto.budget;
    project.category = createProjectDto.category;
    project.ownerId = user.id;

    if (createProjectDto.interests && createProjectDto.interests.length > 0) {
      const interests = await this.interestsRepository.findByIds(createProjectDto.interests);
      project.interests = interests;
    }

    return await this.projectsRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectsRepository.find({
      relations: ['owner', 'interests'],
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner', 'interests'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, userRole: UserRole): Promise<Project> {
    console.log(`Tentative de mise à jour du projet ${id} par l'utilisateur ${userId}`);
    
    const project = await this.findOne(id);
    console.log('Projet trouvé:', project);
    console.log('ownerId:', project.ownerId);
    console.log('userId:', userId);
    console.log('userRole:', userRole);
    
    if (project.ownerId !== userId) {
      console.log('Les IDs ne correspondent pas');
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres projets');
    }

    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const project = await this.findOne(id);
    
    if (project.ownerId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own projects or must be an admin');
    }

    await this.projectsRepository.remove(project);
  }
} 