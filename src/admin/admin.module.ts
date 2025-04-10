import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Investment } from '../investments/entities/investment.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Investment]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {} 