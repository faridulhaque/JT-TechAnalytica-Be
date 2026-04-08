import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@/infrastructure/dto/loginDto';
import { EmployeeAuthGuard } from '@/infrastructure/guards/employeeAuthGuard';
import type { RequestWithUser } from '@/infrastructure/types/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @SetMetadata('statusCode', 201)
  async login(@Body() dto: LoginDto) {
    return await this.authService.loginUser(dto);
  }

  @UseGuards(EmployeeAuthGuard)
  @Get('/check')
  @SetMetadata('statusCode', 201)
  async updateTaskStatus(@Request() request: RequestWithUser) {
    return request?.user;
  }
}
