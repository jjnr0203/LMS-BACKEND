import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerRepositoryPort } from '@domain/ports/outbound/academic/career-repository.port';
import { CareerOrmEntity } from '../../../database/entities/academic/career.orm-entity';
import { Career } from '@domain/entities/academic/career.entity';

@Injectable()
export class CareerPostgresRepository implements CareerRepositoryPort {
  constructor(
    @InjectRepository(CareerOrmEntity)
    private readonly repository: Repository<CareerOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: CareerOrmEntity): Career {
    return new Career(
      ormEntity.id,
      ormEntity.name,
      ormEntity.code,
      ormEntity.durationSemesters,
      ormEntity.modalityId,
      ormEntity.coordinatorId,
      ormEntity.isActive,
    );
  }

  private mapToOrm(domainEntity: Career): CareerOrmEntity {
    const ormEntity = new CareerOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.code = domainEntity.code;
    ormEntity.durationSemesters = domainEntity.durationSemesters;
    if (domainEntity.modalityId) ormEntity.modalityId = domainEntity.modalityId;
    if (domainEntity.coordinatorId) ormEntity.coordinatorId = domainEntity.coordinatorId;
    ormEntity.isActive = domainEntity.isActive;
    return ormEntity;
  }

  async save(career: Career): Promise<Career> {
    const saved = await this.repository.save(this.mapToOrm(career));
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Career | null> {
    const found = await this.repository.findOne({ where: { id }, relations: ['modality', 'coordinator'] });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<Career[]> {
    const all = await this.repository.find({ order: { name: 'ASC' }, relations: ['modality', 'coordinator'] });
    return all.map((o) => this.mapToDomain(o));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
