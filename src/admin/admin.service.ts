import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Investment } from '../investments/entities/investment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Investment)
    private investmentsRepository: Repository<Investment>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }
    await this.usersRepository.remove(user);
  }

  async findAllInvestments(): Promise<Investment[]> {
    return await this.investmentsRepository.find({
      relations: {
        investor: true,
        project: {
          owner: true,
          interests: true
        }
      },
      order: {
        date: 'DESC'
      }
    });
  }
} 