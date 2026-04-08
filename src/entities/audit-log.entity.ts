import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskEntity } from './task.entity';

export const AUDIT_ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  ASSIGNMENT_CHANGE: 'ASSIGNMENT_CHANGE',
} as const;

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

@Entity('audit_log')
export class AuditLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => UserEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  actor!: UserEntity;

  @Column({
    type: 'varchar',
  })
  action!: AuditAction;

  @ManyToOne(() => TaskEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  targetTask!: TaskEntity;

  @Column({ type: 'jsonb', nullable: true })
  data!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
