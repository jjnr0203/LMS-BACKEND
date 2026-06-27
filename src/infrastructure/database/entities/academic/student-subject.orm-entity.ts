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
import { SubjectOrmEntity } from './subject.orm-entity';

@Entity('student_subjects')
export class StudentSubjectOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: UserOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: UserOrmEntity;

  @CreateDateColumn({ name: 'enrolled_at' })
  enrolledAt: Date;
}
