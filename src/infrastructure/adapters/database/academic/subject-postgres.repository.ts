import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { SubjectEntity } from '@domain/entities/academic/subject.entity';
import { SubjectOrmEntity } from '../../../database/entities/academic/subject.orm-entity';

@Injectable()
export class SubjectPostgresRepository implements SubjectRepositoryPort {
  constructor(
    @InjectRepository(SubjectOrmEntity)
    private readonly repository: Repository<SubjectOrmEntity>,
  ) {}

  async findById(id: string): Promise<SubjectEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<SubjectEntity | null> {
    const orm = await this.repository.findOne({ where: { code } });
    return orm ? this.toDomain(orm) : null;
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

  async findByCoordinatorId(coordinatorId: string): Promise<SubjectEntity[]> {
    const orms = await this.repository.find({ where: { coordinatorId } });
    return orms.map((o) => this.toDomain(o));
  }

  private toDomain(orm: SubjectOrmEntity): SubjectEntity {
    return new SubjectEntity(
      orm.id,
      orm.name,
      orm.code,
      orm.credits,
      orm.coordinatorId,
      orm.description,
    );
  }

  private toOrm(entity: SubjectEntity): SubjectOrmEntity {
    const orm = new SubjectOrmEntity();
    orm.id = entity.id;
    orm.name = entity.name;
    orm.code = entity.code;
    orm.credits = entity.credits;
    orm.coordinatorId = entity.coordinatorId;
    orm.description = entity.description;
    return orm;
  }
}
