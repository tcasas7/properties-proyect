import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
