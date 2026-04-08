import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export const TASK_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  DONE: 'DONE',
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({
    type: 'varchar',
    default: TASK_STATUS.PENDING,
  })
  status!: TaskStatus;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  assignedUser!: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.createdTasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  assignedBy!: UserEntity;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
