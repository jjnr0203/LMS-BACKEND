import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyRepositoryPort } from '@domain/ports/outbound/academic/faculty-repository.port';
import { FacultyOrmEntity } from '../../../database/entities/academic/faculty.orm-entity';
import { Faculty } from '@domain/entities/academic/faculty.entity';

@Injectable()
export class FacultyPostgresRepository implements FacultyRepositoryPort {
  constructor(
    @InjectRepository(FacultyOrmEntity)
    private readonly repository: Repository<FacultyOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: FacultyOrmEntity): Faculty {
    return new Faculty(
      ormEntity.id,
      ormEntity.name,
      ormEntity.code,
      ormEntity.description,
      ormEntity.isActive,
      ormEntity.createdAt,
    );
  }

  private mapToOrm(domainEntity: Faculty): FacultyOrmEntity {
    const ormEntity = new FacultyOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.code = domainEntity.code;
    ormEntity.description = domainEntity.description;
    ormEntity.isActive = domainEntity.isActive;
    return ormEntity;
  }

  async save(faculty: Faculty): Promise<Faculty> {
    const saved = await this.repository.save(this.mapToOrm(faculty));
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Faculty | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<Faculty[]> {
    const all = await this.repository.find({ order: { name: 'ASC' } });
    return all.map((o) => this.mapToDomain(o));
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id as any } }); if (entity) { await this.repository.remove(entity); } else { await this.repository.delete(id); }
  }
}

