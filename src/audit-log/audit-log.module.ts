import { Module } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { EnvironmentConfigModule, ServiceLevelLogger } from '@/infrastructure';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from '@/entities/audit-log.entity';
import { TLoggers } from '@/infrastructure/types/enums';

@Module({
  imports: [
    EnvironmentConfigModule,
    JwtModule,
    TypeOrmModule.forFeature([AuditLogEntity]),
  ],
  providers: [
    AuditLogService,
    {
      provide: TLoggers.AUDIT_LOG,
      useValue: new ServiceLevelLogger(TLoggers.AUDIT_LOG),
    },
  ],
  controllers: [AuditLogController],
})
export class AuditLogModule {}
