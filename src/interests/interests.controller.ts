import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('interests')
@UseGuards(JwtAuthGuard)
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get()
  findAll() {
    return this.interestsService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createInterestDto: CreateInterestDto) {
    return this.interestsService.create(createInterestDto);
  }

  @Post('user')
  addUserInterests(
    @Req() req,
    @Body('interestIds') interestIds: string[],
  ) {
    return this.interestsService.addUserInterests(req.user.id, interestIds);
  }

  @Get('user')
  getUserInterests(@Req() req) {
    return this.interestsService.getUserInterests(req.user.id);
  }

  @Get('recommendations')
  getRecommendedProjects(@Req() req) {
    return this.interestsService.getRecommendedProjects(req.user.id);
  }
} 