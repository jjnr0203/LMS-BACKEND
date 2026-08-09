import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { EnrollmentSubjectEntity } from '@domain/entities/secretary/enrollment-subject.entity';
import { EnrollmentDetailOrmEntity } from './enrollment-detail.orm-entity';
import { SubjectOrmEntity } from '../academic/subject.orm-entity';

@Entity('enrollment_subjects')
export class EnrollmentSubjectOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid', name: 'enrollment_detail_id' })
  enrollmentDetailId: string;

  @ManyToOne(() => EnrollmentDetailOrmEntity)
  @JoinColumn({ name: 'enrollment_detail_id' })
  enrollmentDetail: EnrollmentDetailOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Column({ type: 'varchar', length: 20, default: 'enrolled' })
  status: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  static toDomain(orm: EnrollmentSubjectOrmEntity): EnrollmentSubjectEntity {
    return new EnrollmentSubjectEntity(
      orm.id,
      orm.enrollmentDetailId,
      orm.subjectId,
      orm.status,
      orm.grade,
      orm.createdAt,
    );
  }

  static fromDomain(
    entity: EnrollmentSubjectEntity,
  ): EnrollmentSubjectOrmEntity {
    const orm = new EnrollmentSubjectOrmEntity();
    orm.id = entity.id;
    orm.enrollmentDetailId = entity.enrollmentDetailId;
    orm.subjectId = entity.subjectId;
    orm.status = entity.status;
    orm.grade = entity.grade;
    return orm;
  }
}
