import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicTermRepositoryPort } from '@domain/ports/outbound/academic/academic-term-repository.port';
import { AcademicTermOrmEntity } from '../../../database/entities/academic/academic-term.orm-entity';
import { AcademicTerm } from '@domain/entities/academic/academic-term.entity';

@Injectable()
export class AcademicTermPostgresRepository implements AcademicTermRepositoryPort {
  constructor(
    @InjectRepository(AcademicTermOrmEntity)
    private readonly repository: Repository<AcademicTermOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: AcademicTermOrmEntity): AcademicTerm {
    return new AcademicTerm(
      ormEntity.id,
      ormEntity.name,
      ormEntity.startDate,
      ormEntity.endDate,
      ormEntity.isActive,
    );
  }

  private mapToOrm(domainEntity: AcademicTerm): AcademicTermOrmEntity {
    const ormEntity = new AcademicTermOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.startDate = domainEntity.startDate;
    ormEntity.endDate = domainEntity.endDate;
    ormEntity.isActive = domainEntity.isActive;
    return ormEntity;
  }

  async save(term: AcademicTerm): Promise<AcademicTerm> {
    const saved = await this.repository.save(this.mapToOrm(term));
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<AcademicTerm | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<AcademicTerm[]> {
    const all = await this.repository.find({ order: { startDate: 'DESC' } });
    return all.map((o) => this.mapToDomain(o));
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id as any } }); if (entity) { await this.repository.remove(entity); } else { await this.repository.delete(id); }
  }

  async deactivateAllExcept(id: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(AcademicTermOrmEntity)
      .set({ isActive: false })
      .where('id != :id', { id })
      .execute();
  }
}

