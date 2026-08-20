import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModalityRepositoryPort } from '@domain/ports/outbound/academic/modality-repository.port';
import { ModalityOrmEntity } from '../../../database/entities/academic/modality.orm-entity';
import { Modality } from '@domain/entities/academic/modality.entity';

@Injectable()
export class ModalityPostgresRepository implements ModalityRepositoryPort {
  constructor(
    @InjectRepository(ModalityOrmEntity)
    private readonly repository: Repository<ModalityOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: ModalityOrmEntity): Modality {
    return new Modality(
      ormEntity.id,
      ormEntity.name,
      ormEntity.isActive,
      ormEntity.description,
    );
  }

  private mapToOrm(domainEntity: Modality): ModalityOrmEntity {
    const ormEntity = new ModalityOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.isActive = domainEntity.isActive;
    if (domainEntity.description)
      ormEntity.description = domainEntity.description;
    return ormEntity;
  }

  async save(modality: Modality): Promise<Modality> {
    const saved = await this.repository.save(this.mapToOrm(modality));
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Modality | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<Modality[]> {
    const all = await this.repository.find({ order: { name: 'ASC' } });
    return all.map((o) => this.mapToDomain(o));
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id as any } }); if (entity) { await this.repository.remove(entity); } else { await this.repository.delete(id); }
  }
}

