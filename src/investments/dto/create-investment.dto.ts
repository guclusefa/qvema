import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateInvestmentDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
} 