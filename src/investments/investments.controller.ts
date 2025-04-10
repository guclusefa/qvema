import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('investments')
@UseGuards(JwtAuthGuard)
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  @Roles(Role.INVESTOR)
  @UseGuards(RolesGuard)
  create(@Body() createInvestmentDto: CreateInvestmentDto, @Request() req) {
    return this.investmentsService.create(createInvestmentDto, req.user.id);
  }

  @Get()
  @Roles(Role.INVESTOR)
  @UseGuards(RolesGuard)
  findAll(@Request() req) {
    return this.investmentsService.findAll(req.user.id);
  }

  @Get('project/:id')
  findByProject(@Param('id') id: string, @Request() req) {
    return this.investmentsService.findByProject(id, req.user.id);
  }

  @Delete(':id')
  @Roles(Role.INVESTOR)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.investmentsService.remove(id, req.user.id);
  }
} 