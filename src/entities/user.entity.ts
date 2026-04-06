import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt!: Date;
}
