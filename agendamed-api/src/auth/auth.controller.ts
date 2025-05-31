import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body(new ValidationPipe()) loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
