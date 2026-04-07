import { AuditLogEntity } from '@/entities/audit-log.entity';
import { ServiceLevelLogger } from '@/infrastructure';
import { TLoggers } from '@/infrastructure/types/enums';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject(TLoggers.AUDIT_LOG)
    private logger: ServiceLevelLogger,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}
}
