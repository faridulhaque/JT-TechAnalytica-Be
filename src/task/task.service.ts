import { TaskEntity } from '@/entities/task.entity';
import { UserEntity } from '@/entities/user.entity';
import { EnvironmentConfigService, ServiceLevelLogger } from '@/infrastructure';
import { TLoggers } from '@/infrastructure/types/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TLoggers.TASK)
    private logger: ServiceLevelLogger,
    private readonly envConfig: EnvironmentConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getEmployees(): Promise<UserEntity[]> {
    try {
      this.logger.verbose(`Searching for users`);

      const users = await this.userRepository.find({
        where: {
          role: 'employee',
        },
        select: {
          id: true,
          username: true,
        },
        order: {
          username: 'ASC',
        },
      });

      return users;
    } catch (error: any) {
      this.logger.error(error.message || 'Error finding users');
      throw new HttpException(
        error.message || 'Error while finding conversation',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
