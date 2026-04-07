import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { AdminAuthGuard } from '@/infrastructure/guards/adminAuthGuard';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}
//   @UseGuards(AdminAuthGuard)
  @Get('/employees')
  @SetMetadata('statusCode', 201)
  async getAllUsers() {
    return await this.taskService.getEmployees();
  }
}
