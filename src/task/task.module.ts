import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/entities/user.entity';
import { TLoggers } from '@/infrastructure/types/enums';
import { EnvironmentConfigModule, ServiceLevelLogger } from '@/infrastructure';
import { TaskEntity } from '@/entities/task.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EnvironmentConfigModule,
    JwtModule,
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],

  providers: [
    TaskService,
    {
      provide: TLoggers.TASK,
      useValue: new ServiceLevelLogger(TLoggers.TASK),
    },
  ],
  controllers: [TaskController],
})
export class TaskModule {}
