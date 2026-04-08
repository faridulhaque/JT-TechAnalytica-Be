import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EnvironmentConfigModule, TypeOrmConfigModule } from './infrastructure';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './task/task.module';
import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmConfigModule,
    JwtModule,
    EnvironmentConfigModule,
    AuthModule,
    TaskModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
