import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from '../users/user.orm-entity';
import { SubjectOrmEntity } from './subject.orm-entity';

@Entity('teacher_subjects')
export class TeacherSubjectOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'teacher_id' })
  teacher: UserOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Column({
    type: 'timestamp',
    name: 'assigned_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt: Date;
}
