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
import { AssignmentOrmEntity } from './assignment.orm-entity';

@Entity('submissions')
export class SubmissionOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'assignment_id' })
  assignmentId: string;

  @ManyToOne(() => AssignmentOrmEntity)
  @JoinColumn({ name: 'assignment_id' })
  assignment: AssignmentOrmEntity;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: UserOrmEntity;

  @Column({ type: 'varchar', length: 500, name: 'file_url' })
  fileUrl: string;

  @Column({ type: 'float', nullable: true })
  grade?: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @CreateDateColumn({ name: 'submitted_at' })
  submittedAt: Date;
}
