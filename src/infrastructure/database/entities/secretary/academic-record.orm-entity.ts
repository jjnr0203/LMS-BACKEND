import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AcademicRecordEntity } from '@domain/entities/secretary/academic-record.entity';
import { StudentOrmEntity } from '../users/student.orm-entity';
import { SubjectOrmEntity } from '../academic/subject.orm-entity';
import { AcademicTermOrmEntity } from '../academic/academic-term.orm-entity';

@Entity('academic_records')
export class AcademicRecordOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'student_id' })
  studentId: string;

  @ManyToOne(() => StudentOrmEntity)
  @JoinColumn({ name: 'student_id' })
  student: StudentOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'subject_id' })
  subjectId: string;

  @ManyToOne(() => SubjectOrmEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectOrmEntity;

  @Index()
  @Column({ type: 'uuid', name: 'academic_term_id' })
  academicTermId: string;

  @ManyToOne(() => AcademicTermOrmEntity)
  @JoinColumn({ name: 'academic_term_id' })
  academicTerm: AcademicTermOrmEntity;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  grade: number;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'int' })
  credits: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  static toDomain(orm: AcademicRecordOrmEntity): AcademicRecordEntity {
    return new AcademicRecordEntity(
      orm.id,
      orm.studentId,
      orm.subjectId,
      orm.academicTermId,
      orm.grade,
      orm.status,
      orm.credits,
      orm.createdAt,
    );
  }

  static fromDomain(entity: AcademicRecordEntity): AcademicRecordOrmEntity {
    const orm = new AcademicRecordOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.subjectId = entity.subjectId;
    orm.academicTermId = entity.academicTermId;
    orm.grade = entity.grade;
    orm.status = entity.status;
    orm.credits = entity.credits;
    return orm;
  }
}
