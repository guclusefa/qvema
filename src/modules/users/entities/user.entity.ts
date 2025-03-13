import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from '../types-dto/user-role.type';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Exclude() //+modification à faire dans le service
  @Column()
  password: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ENTREPRENEUR })
  role: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
