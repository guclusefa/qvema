import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './types-dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return plainToInstance(User, users);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return plainToInstance(User, user);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    //vérification que l'email n'existe pas déjà en bdd
    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }
    //hash du mot de passe
    const saltRounds = 10; //*bon équilibre sécurité/performances
    const hashPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    //insert et return de l'instance User
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
    const savedUser = await this.userRepository.save(newUser);
    return plainToInstance(User, savedUser); //pour exclure le mdp de l'exposition
  }

  async findByEmail(email: string) {
    const user = plainToInstance(
      User,
      await this.userRepository.findOneBy({ email }),
    );
    return user;
  }
}
