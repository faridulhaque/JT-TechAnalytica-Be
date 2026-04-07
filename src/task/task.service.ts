import { AUDIT_ACTION, AuditLogEntity } from '@/entities/audit-log.entity';
import { TaskEntity, TaskStatus } from '@/entities/task.entity';
import { UserEntity } from '@/entities/user.entity';
import { EnvironmentConfigService, ServiceLevelLogger } from '@/infrastructure';
import { CreateTaskDto } from '@/infrastructure/dto/createTaskDto';
import { TLoggers } from '@/infrastructure/types/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TLoggers.TASK)
    private logger: ServiceLevelLogger,
    private readonly envConfig: EnvironmentConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private dataSource: DataSource,
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

  async createTask(assignerId: string, dto: CreateTaskDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title, description, employeeId } = dto;

      const task = queryRunner.manager.create(TaskEntity, {
        title,
        description,
        assignedUser: { id: employeeId },
        assignedBy: { id: assignerId },
      });

      const savedTask = await queryRunner.manager.save(task);

      const auditLog = queryRunner.manager.create(AuditLogEntity, {
        actor: { id: assignerId },
        action: AUDIT_ACTION.CREATE,
        targetTask: savedTask,
        data: {
          title,
          description,
          employeeId,
        },
      });

      await queryRunner.manager.save(auditLog);

      await queryRunner.commitTransaction();

      return savedTask;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Error creating task: ${error?.message}`);
      throw new HttpException(
        error?.message || 'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateTask(adminId: string, taskId: string, dto: CreateTaskDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = await queryRunner.manager.findOne(TaskEntity, {
        where: { id: taskId },
        relations: ['assignedUser'],
      });

      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      let assignmentChanged = false;
      let newAssignee: UserEntity | null = null;

      if (dto.employeeId && dto.employeeId !== task.assignedUser?.id) {
        newAssignee = await queryRunner.manager.findOne(UserEntity, {
          where: { id: dto.employeeId },
        });

        if (!newAssignee) {
          throw new HttpException(
            'New employee not found',
            HttpStatus.NOT_FOUND,
          );
        }

        task.assignedUser = newAssignee;
        assignmentChanged = true;
      }

      if (dto.title !== undefined) task.title = dto.title;
      if (dto.description !== undefined) task.description = dto.description;

      const updatedTask = await queryRunner.manager.save(task);

      const updateLog = queryRunner.manager.create(AuditLogEntity, {
        actor: { id: adminId },
        action: AUDIT_ACTION.UPDATE,
        targetTask: updatedTask,
        data: dto,
      });

      await queryRunner.manager.save(updateLog);

      if (assignmentChanged && newAssignee) {
        const assignmentLog = queryRunner.manager.create(AuditLogEntity, {
          actor: { id: adminId },
          action: AUDIT_ACTION.ASSIGNMENT_CHANGE,
          targetTask: updatedTask,
          data: {
            from: task.assignedUser?.id,
            to: newAssignee.id,
          },
        });

        await queryRunner.manager.save(assignmentLog);
      }

      await queryRunner.commitTransaction();

      return updatedTask;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Error updating task: ${error?.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error?.message || 'Failed to update task',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateTaskStatus(employeeId: string, taskId: string, status: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updatedTask = await queryRunner.manager.update(
        TaskEntity,
        { id: taskId },
        { status: status as TaskStatus },
      );

      const statusLog = queryRunner.manager.create(AuditLogEntity, {
        actor: { id: employeeId },
        action: AUDIT_ACTION.STATUS_CHANGE,
        targetTask: { id: taskId },
        data: { data: 'n/a' },
      });

      await queryRunner.manager.save(statusLog);

      await queryRunner.commitTransaction();

      return updatedTask;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Error updating task status: ${error?.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error?.message || 'Failed to update task status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deleteTask(adminId: string, taskId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const softDeleted = await queryRunner.manager.update(
        TaskEntity,
        { id: taskId },
        { isDeleted: true },
      );

      const statusLog = queryRunner.manager.create(AuditLogEntity, {
        actor: { id: adminId },
        action: AUDIT_ACTION.DELETE,
        targetTask: { id: taskId },
      });

      await queryRunner.manager.save(statusLog);

      await queryRunner.commitTransaction();

      return softDeleted;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Error deleting task  : ${error?.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error?.message || 'Failed to soft delete task ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getTasks(userId: string, role: string) {
    try {
      this.logger.log(`Fetching tasks for user ${userId} with role ${role}`);

      const qb = this.dataSource
        .getRepository(TaskEntity)
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.assignedUser', 'assignedUser')
        .leftJoinAndSelect('task.assignedBy', 'assignedBy')
        .where('task.isDeleted = :isDeleted', { isDeleted: false });

      if (role === 'employee') {
        qb.andWhere('assignedUser.id = :userId', { userId });
      }

      const tasks = await qb.getMany();

      return tasks;
    } catch (error: any) {
      this.logger.error(`Error fetching tasks: ${error?.message}`);

      throw new HttpException(
        error?.message || 'Failed to fetch tasks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
