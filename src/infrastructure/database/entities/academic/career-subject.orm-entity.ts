import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CareerOrmEntity } from './career.orm-entity';
import { SubjectOrmEntity } from './subject.orm-entity';

@Entity('career_subjects')
export class CareerSubjectOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'career_id' })
  careerId: string;

  @ManyToOne(() => CareerOrmEntity)
  @JoinColumn({ name: 'career_id' })
  career: CareerOrmEntity;

  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Column({ type: 'int', default: 1 })
  semester: number;
}
