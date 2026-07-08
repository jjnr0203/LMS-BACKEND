import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { SubjectEntity } from '@domain/entities/academic/subject.entity';
import { SubjectOrmEntity } from '../../../database/entities/academic/subject.orm-entity';
import { ModalityOrmEntity } from '../../../database/entities/academic/modality.orm-entity';
import { CareerSubjectOrmEntity } from '../../../database/entities/academic/career-subject.orm-entity';

@Injectable()
export class SubjectPostgresRepository implements SubjectRepositoryPort {
  constructor(
    @InjectRepository(SubjectOrmEntity)
    private readonly repository: Repository<SubjectOrmEntity>,
  ) {}

  async findById(id: string): Promise<SubjectEntity | null> {
    const orm = await this.repository.findOne({
      where: { id },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByIds(ids: string[]): Promise<SubjectEntity[]> {
    if (ids.length === 0) return [];
    const orms = await this.repository.find({
      where: { id: In(ids) },
    });
    return orms.map((o) => this.toDomain(o));
  }

  async findByCode(code: string): Promise<SubjectEntity | null> {
    const orm = await this.repository.findOne({
      where: { code },

    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByCodes(codes: string[]): Promise<SubjectEntity[]> {
    if (codes.length === 0) return [];
    const orms = await this.repository.find({
      where: { code: In(codes) },

    });
    return orms.map((o) => this.toDomain(o));
  }

  async save(subject: SubjectEntity): Promise<SubjectEntity> {
    const orm = this.toOrm(subject);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findAll(): Promise<SubjectEntity[]> {
    const orms = await this.repository.find();
    return orms.map((o) => this.toDomain(o));
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findByTeacherId(teacherId: string): Promise<SubjectEntity[]> {
    const orms = await this.repository.find({
      where: { teacherId },

    });
    return orms.map((o) => this.toDomain(o));
  }

  async delete(id: string): Promise<void> {
    await this.repository.manager.query(
      'DELETE FROM teacher_subjects WHERE subject_id = $1',
      [id],
    );
    await this.repository.manager.query(
      'DELETE FROM student_subjects WHERE subject_id = $1',
      [id],
    );
    await this.repository.manager.delete(CareerSubjectOrmEntity, {
      subjectId: id,
    });
    await this.repository.delete(id);
  }

  private toDomain(orm: SubjectOrmEntity): SubjectEntity {
    return new SubjectEntity(
      orm.id,
      orm.name,
      orm.code,
      orm.credits,
      orm.hours || 0,

      orm.teacherId,
      orm.description,
    );
  }

  private toOrm(entity: SubjectEntity): SubjectOrmEntity {
    const orm = new SubjectOrmEntity();
    orm.id = entity.id;
    orm.name = entity.name;
    orm.code = entity.code;
    orm.credits = entity.credits;
    orm.hours = entity.hours || 0;

    if (entity.teacherId) orm.teacherId = entity.teacherId;
    orm.description = entity.description;
    return orm;
  }
}
