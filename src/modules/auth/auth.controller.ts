import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() user: User) {
    console.log(user);
    return this.authService.login(user);
  }

  //pour tester le guard : uniquement si token renseigné et valide, sinon err 401
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile() {
    return {
      message: 'page de profil',
    };
  }
}
