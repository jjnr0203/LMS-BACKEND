import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const orm = await this.repository.findOne({ where: { id }, relations: ['modalities'] });
    return orm ? this.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<SubjectEntity | null> {
    const orm = await this.repository.findOne({ where: { code }, relations: ['modalities'] });
    return orm ? this.toDomain(orm) : null;
  }

  async save(subject: SubjectEntity): Promise<SubjectEntity> {
    const orm = this.toOrm(subject);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findAll(): Promise<SubjectEntity[]> {
    const orms = await this.repository.find({ relations: ['modalities'] });
    return orms.map((o) => this.toDomain(o));
  }

  async findByTeacherId(teacherId: string): Promise<SubjectEntity[]> {
    const orms = await this.repository.find({ where: { teacherId }, relations: ['modalities'] });
    return orms.map((o) => this.toDomain(o));
  }

  async delete(id: string): Promise<void> {
    await this.repository.manager.query('DELETE FROM teacher_subjects WHERE subject_id = $1', [id]);
    await this.repository.manager.query('DELETE FROM student_subjects WHERE subject_id = $1', [id]);
    await this.repository.manager.delete(CareerSubjectOrmEntity, { subjectId: id });
    await this.repository.delete(id);
  }

  private toDomain(orm: SubjectOrmEntity): SubjectEntity {
    return new SubjectEntity(
      orm.id,
      orm.name,
      orm.code,
      orm.credits,
      orm.modalities ? orm.modalities.map(m => m.id) : [],
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
    if (entity.modalityIds && entity.modalityIds.length > 0) {
      orm.modalities = entity.modalityIds.map(id => {
        const m = new ModalityOrmEntity();
        m.id = id;
        return m;
      });
    } else {
      orm.modalities = [];
    }
    if (entity.teacherId) orm.teacherId = entity.teacherId;
    orm.description = entity.description;
    return orm;
  }
}
