import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubjectRepositoryPort } from '@domain/ports/outbound/academic/student-subject-repository.port';
import { StudentSubjectEntity } from '@domain/entities/academic/student-subject.entity';
import { StudentSubjectOrmEntity } from '../../../database/entities/academic/student-subject.orm-entity';

@Injectable()
export class StudentSubjectPostgresRepository implements StudentSubjectRepositoryPort {
  constructor(
    @InjectRepository(StudentSubjectOrmEntity)
    private readonly repository: Repository<StudentSubjectOrmEntity>,
  ) {}

  async findById(id: string): Promise<StudentSubjectEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(relation: StudentSubjectEntity): Promise<StudentSubjectEntity> {
    const orm = this.toOrm(relation);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findByStudentId(studentId: string): Promise<StudentSubjectEntity[]> {
    const orms = await this.repository.find({ where: { studentId } });
    return orms.map((o) => this.toDomain(o));
  }

  async findBySubjectId(subjectId: string): Promise<StudentSubjectEntity[]> {
    const orms = await this.repository.find({ where: { subjectId } });
    return orms.map((o) => this.toDomain(o));
  }

  async findByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<StudentSubjectEntity | null> {
    const orm = await this.repository.findOne({
      where: { studentId, subjectId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByTeacherId(teacherId: string): Promise<StudentSubjectEntity[]> {
    const orms = await this.repository.find({ where: { teacherId } });
    return orms.map((o) => this.toDomain(o));
  }

  private toDomain(orm: StudentSubjectOrmEntity): StudentSubjectEntity {
    return new StudentSubjectEntity(
      orm.id,
      orm.studentId,
      orm.subjectId,
      orm.teacherId,
      orm.enrolledAt,
    );
  }

  private toOrm(entity: StudentSubjectEntity): StudentSubjectOrmEntity {
    const orm = new StudentSubjectOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.subjectId = entity.subjectId;
    orm.teacherId = entity.teacherId;
    orm.enrolledAt = entity.enrolledAt;
    return orm;
  }
}
