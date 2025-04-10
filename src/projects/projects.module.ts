import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { User } from '../users/entities/user.entity';
import { Interest } from '../interests/entities/interest.entity';
import { InterestsModule } from '../interests/interests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, Interest]),
    InterestsModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
