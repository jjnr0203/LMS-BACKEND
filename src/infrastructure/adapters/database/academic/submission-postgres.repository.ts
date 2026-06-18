import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmissionRepositoryPort } from '@domain/ports/outbound/academic/submission-repository.port';
import { SubmissionEntity } from '@domain/entities/academic/submission.entity';
import { SubmissionOrmEntity } from '../../../database/entities/academic/submission.orm-entity';

@Injectable()
export class SubmissionPostgresRepository implements SubmissionRepositoryPort {
  constructor(
    @InjectRepository(SubmissionOrmEntity)
    private readonly repository: Repository<SubmissionOrmEntity>,
  ) {}

  async findById(id: string): Promise<SubmissionEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(submission: SubmissionEntity): Promise<SubmissionEntity> {
    const orm = this.toOrm(submission);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findByAssignmentId(assignmentId: string): Promise<SubmissionEntity[]> {
    const orms = await this.repository.find({ where: { assignmentId } });
    return orms.map((o) => this.toDomain(o));
  }

  async findByStudentId(studentId: string): Promise<SubmissionEntity[]> {
    const orms = await this.repository.find({ where: { studentId } });
    return orms.map((o) => this.toDomain(o));
  }

  async findByAssignmentAndStudent(
    assignmentId: string,
    studentId: string,
  ): Promise<SubmissionEntity | null> {
    const orm = await this.repository.findOne({
      where: { assignmentId, studentId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  private toDomain(orm: SubmissionOrmEntity): SubmissionEntity {
    return new SubmissionEntity(
      orm.id,
      orm.assignmentId,
      orm.studentId,
      orm.fileUrl,
      orm.grade ?? null,
      orm.feedback ?? null,
      orm.submittedAt,
    );
  }

  private toOrm(entity: SubmissionEntity): SubmissionOrmEntity {
    const orm = new SubmissionOrmEntity();
    orm.id = entity.id;
    orm.assignmentId = entity.assignmentId;
    orm.studentId = entity.studentId;
    orm.fileUrl = entity.fileUrl;
    orm.grade = entity.grade ?? undefined;
    orm.feedback = entity.feedback ?? undefined;
    return orm;
  }
}
