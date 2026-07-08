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

  @Column({ type: 'uuid', name: 'curriculum_id', nullable: true })
  curriculumId?: string;

  @Index()
  @Column({ type: 'uuid', name: 'academic_term_id', nullable: true })
  academicTermId?: string;

  @ManyToOne('AcademicTermOrmEntity', { nullable: true })
  @JoinColumn({ name: 'academic_term_id' })
  academicTerm?: any;

  @Index()
  @Column({ type: 'uuid', name: 'modality_id', nullable: true })
  modalityId?: string;

  @ManyToOne('ModalityOrmEntity', { nullable: true })
  @JoinColumn({ name: 'modality_id' })
  modality?: any;

  @Index()
  @Column({ type: 'uuid', name: 'jornada_id', nullable: true })
  jornadaId?: string;

  @ManyToOne('JornadaOrmEntity', { nullable: true })
  @JoinColumn({ name: 'jornada_id' })
  jornada?: any;

  @Column({
    type: 'timestamp',
    name: 'assigned_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  assignedAt: Date;
}
