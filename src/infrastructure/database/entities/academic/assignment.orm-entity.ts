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

@Entity('assignments')
export class AssignmentOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

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

  @Column({ type: 'timestamp', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'int', name: 'max_score', default: 100 })
  maxScore: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
