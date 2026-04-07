import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { AdminAuthGuard } from '@/infrastructure/guards/adminAuthGuard';
import type { RequestWithUser } from '@/infrastructure/types/types';
import { CreateTaskDto } from '@/infrastructure/dto/createTaskDto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
  @UseGuards(AdminAuthGuard)
  @Get('/employees')
  @SetMetadata('statusCode', 201)
  async getAllUsers() {
    return await this.taskService.getEmployees();
  }

  @UseGuards(AdminAuthGuard)
  @Post('/')
  @SetMetadata('statusCode', 201)
  async createTask(
    @Request() request: RequestWithUser,
    @Body() body: CreateTaskDto,
  ) {
    return await this.taskService.createTask(request?.user?.id, body);
  }

  @UseGuards(AdminAuthGuard)
  @Put('/:taskId')
  @SetMetadata('statusCode', 201)
  async updateTask(
    @Request() request: RequestWithUser,
    @Body() body: CreateTaskDto,
    @Param('taskId') taskId: string,
  ) {
    return await this.taskService.updateTask(request?.user?.id, taskId, body);
  }
}
