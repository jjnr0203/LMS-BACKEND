import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '@domain/entities/academic/tuition.entity';
import { TuitionOrmEntity } from '../../../database/entities/academic/tuition.orm-entity';

@Injectable()
export class TuitionPostgresRepository implements TuitionRepositoryPort {
  constructor(
    @InjectRepository(TuitionOrmEntity)
    private readonly repository: Repository<TuitionOrmEntity>,
  ) {}

  async findById(id: string): Promise<TuitionEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByStudentId(studentId: string): Promise<TuitionEntity | null> {
    const orm = await this.repository.findOne({ where: { studentId } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(tuition: TuitionEntity): Promise<TuitionEntity> {
    const orm = this.toOrm(tuition);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findAllWithStudent(
    limit = 100,
    offset = 0,
  ): Promise<{ data: TuitionEntity[]; total: number }> {
    const [orms, total] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { data: orms.map((o) => this.toDomain(o)), total };
  }

  async findByStatus(status: string): Promise<TuitionEntity[]> {
    const orms = await this.repository.find({ where: { status } });
    return orms.map((o) => this.toDomain(o));
  }

  private toDomain(orm: TuitionOrmEntity): TuitionEntity {
    return new TuitionEntity(
      orm.id,
      orm.studentId,
      orm.status as TuitionEntity['status'],
      orm.paidInstallments,
    );
  }

  private toOrm(entity: TuitionEntity): TuitionOrmEntity {
    const orm = new TuitionOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.status = entity.status;
    orm.paidInstallments = entity.paidInstallments;
    return orm;
  }
}
