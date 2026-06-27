import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from '../users/user.orm-entity';

@Entity('enrollments')
export class EnrollmentOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: UserOrmEntity;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;
}
