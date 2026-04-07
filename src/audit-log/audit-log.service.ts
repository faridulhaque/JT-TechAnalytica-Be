import { AuditLogEntity } from '@/entities/audit-log.entity';
import { ServiceLevelLogger } from '@/infrastructure';
import { TLoggers } from '@/infrastructure/types/enums';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
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

  async getAllAuditLogs() {
    try {
      this.logger.log('Fetching all audit logs');

      const logs = await this.auditLogRepository.find({
        relations: ['actor', 'targetTask'],
        order: { createdAt: 'DESC' },
      });

      return logs;
    } catch (error: any) {
      this.logger.error(`Error fetching audit logs: ${error?.message}`);

      throw new HttpException(
        error?.message || 'Failed to fetch audit logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
