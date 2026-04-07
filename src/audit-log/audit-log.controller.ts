import {
  Controller,
  Get,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AdminAuthGuard } from '@/infrastructure/guards/adminAuthGuard';
import type { RequestWithUser } from '@/infrastructure/types/types';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}
  @UseGuards(AdminAuthGuard)
  @Get()
  @SetMetadata('statusCode', 200)
  async getTasks(@Request() request: RequestWithUser) {
    return await this.auditLogService.getAllAuditLogs();
  }
}
