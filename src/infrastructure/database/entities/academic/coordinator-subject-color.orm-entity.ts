import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SubjectOrmEntity } from './subject.orm-entity';
import { UserOrmEntity } from '../users/user.orm-entity';

@Entity('coordinator_subject_colors')
export class CoordinatorSubjectColorOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'coordinator_id' })
  coordinatorId: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'coordinator_id' })
  coordinator: UserOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Column({ type: 'varchar', length: 50 })
  color: string;
}
