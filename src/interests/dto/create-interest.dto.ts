import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInterestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
} 