import { Body, Controller, Post, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@/infrastructure/dto/loginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @SetMetadata('statusCode', 201)
  async login(@Body() dto: LoginDto) {
    return await this.authService.loginUser(dto);
  }
}
