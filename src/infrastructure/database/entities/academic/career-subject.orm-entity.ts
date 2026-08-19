import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CareerOrmEntity } from './career.orm-entity';
import { SubjectOrmEntity } from './subject.orm-entity';
import { CurriculumOrmEntity } from './curriculum.orm-entity';

@Entity('career_subjects')
export class CareerSubjectOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'career_id' })
  careerId: string;

  @ManyToOne(() => CareerOrmEntity)
  @JoinColumn({ name: 'career_id' })
  career: CareerOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Column({ type: 'int', default: 1 })
  semester: number;

  @Index()
  @Column({ type: 'uuid', name: 'curriculum_id', nullable: true })
  curriculumId?: string;

  @ManyToOne(() => CurriculumOrmEntity)
  @JoinColumn({ name: 'curriculum_id' })
  curriculum?: CurriculumOrmEntity;

  @Column({ type: 'jsonb', name: 'prerequisite_ids', default: [] })
  prerequisiteIds: string[];
}
