import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { EmployeeAuthGuard } from '@/infrastructure/guards/employeeAuthGuard';
import { TaskStatus } from '@/entities/task.entity';

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

  @UseGuards(EmployeeAuthGuard)
  @Patch('/:taskId/status')
  @SetMetadata('statusCode', 201)
  async updateTaskStatus(
    @Request() request: RequestWithUser,
    @Body() body: { status: TaskStatus },
    @Param('taskId') taskId: string,
  ) {
    return await this.taskService.updateTaskStatus(
      request?.user?.id,
      taskId,
      body.status,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Delete('/:taskId')
  @SetMetadata('statusCode', 201)
  async deleteTask(
    @Request() request: RequestWithUser,
    @Param('taskId') taskId: string,
  ) {
    return await this.taskService.deleteTask(request?.user?.id, taskId);
  }

  @UseGuards(EmployeeAuthGuard)
  @Get('')
  @SetMetadata('statusCode', 200)
  async getTasks(@Request() request: RequestWithUser) {
    return await this.taskService.getTasks(
      request?.user?.id,
      request?.user?.role,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Get('/:taskId')
  @SetMetadata('statusCode', 201)
  async getTask(@Param('taskId') taskId: string) {
   return await this.taskService.getTaskById(taskId)
  }
}
