import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';

const ROlE = {
  admin: 'admin',
  employee: 'employee',
};
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ default: ROlE.employee })
  role!: string;

  @OneToMany(() => TaskEntity, (task) => task.assignedUser)
  assignedTasks!: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.assignedBy)
  createdTasks!: TaskEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
