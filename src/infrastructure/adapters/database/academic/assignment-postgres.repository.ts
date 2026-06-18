import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentRepositoryPort } from '@domain/ports/outbound/academic/assignment-repository.port';
import { AssignmentEntity } from '@domain/entities/academic/assignment.entity';
import { AssignmentOrmEntity } from '../../../database/entities/academic/assignment.orm-entity';

@Injectable()
export class AssignmentPostgresRepository implements AssignmentRepositoryPort {
  constructor(
    @InjectRepository(AssignmentOrmEntity)
    private readonly repository: Repository<AssignmentOrmEntity>,
  ) {}

  async findById(id: string): Promise<AssignmentEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(assignment: AssignmentEntity): Promise<AssignmentEntity> {
    const orm = this.toOrm(assignment);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findBySubjectId(subjectId: string): Promise<AssignmentEntity[]> {
    const orms = await this.repository.find({ where: { subjectId } });
    return orms.map((o) => this.toDomain(o));
  }

  async findByTeacherId(teacherId: string): Promise<AssignmentEntity[]> {
    const orms = await this.repository.find({ where: { teacherId } });
    return orms.map((o) => this.toDomain(o));
  }

  private toDomain(orm: AssignmentOrmEntity): AssignmentEntity {
    return new AssignmentEntity(
      orm.id,
      orm.title,
      orm.description,
      orm.subjectId,
      orm.teacherId,
      orm.dueDate,
      orm.maxScore,
      orm.createdAt,
    );
  }

  private toOrm(entity: AssignmentEntity): AssignmentOrmEntity {
    const orm = new AssignmentOrmEntity();
    orm.id = entity.id;
    orm.title = entity.title;
    orm.description = entity.description;
    orm.subjectId = entity.subjectId;
    orm.teacherId = entity.teacherId;
    orm.dueDate = entity.dueDate;
    orm.maxScore = entity.maxScore;
    return orm;
  }
}
