import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  role: UserRole;
} 