import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { EnrollmentDetailEntity } from '@domain/entities/secretary/enrollment-detail.entity';
import { StudentOrmEntity } from '../users/student.orm-entity';
import { AcademicTermOrmEntity } from '../academic/academic-term.orm-entity';
import { CareerOrmEntity } from '../academic/career.orm-entity';

@Entity('enrollment_details')
export class EnrollmentDetailOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'academic_term_id' })
  academicTermId: string;

  @ManyToOne(() => AcademicTermOrmEntity)
  @JoinColumn({ name: 'academic_term_id' })
  academicTerm: AcademicTermOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'career_id' })
  careerId: string;

  @ManyToOne(() => CareerOrmEntity)
  @JoinColumn({ name: 'career_id' })
  career: CareerOrmEntity;

  @Column({ type: 'int', default: 1 })
  level: number;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  static toDomain(orm: EnrollmentDetailOrmEntity): EnrollmentDetailEntity {
    return new EnrollmentDetailEntity(
      orm.id,
      orm.studentId,
      orm.academicTermId,
      orm.careerId,
      orm.level,
      orm.status,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
    );
  }

  static fromDomain(entity: EnrollmentDetailEntity): EnrollmentDetailOrmEntity {
    const orm = new EnrollmentDetailOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.academicTermId = entity.academicTermId;
    orm.careerId = entity.careerId;
    orm.level = entity.level;
    orm.status = entity.status;
    return orm;
  }
}
