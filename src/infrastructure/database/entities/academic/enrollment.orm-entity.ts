import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { StudentOrmEntity } from '../users/student.orm-entity';

@Entity('enrollments')
export class EnrollmentOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentOrmEntity;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;
}
