import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JornadaRepositoryPort } from '@domain/ports/outbound/academic/jornada-repository.port';
import { JornadaOrmEntity } from '../../../database/entities/academic/jornada.orm-entity';
import { Jornada } from '@domain/entities/academic/jornada.entity';

@Injectable()
export class JornadaPostgresRepository implements JornadaRepositoryPort {
  constructor(
    @InjectRepository(JornadaOrmEntity)
    private readonly repository: Repository<JornadaOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: JornadaOrmEntity): Jornada {
    return new Jornada(
      ormEntity.id,
      ormEntity.name,
      ormEntity.isActive,
      ormEntity.description,
    );
  }

  private mapToOrm(domainEntity: Jornada): JornadaOrmEntity {
    const ormEntity = new JornadaOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.name = domainEntity.name;
    ormEntity.isActive = domainEntity.isActive;
    if (domainEntity.description)
      ormEntity.description = domainEntity.description;
    return ormEntity;
  }

  async save(jornada: Jornada): Promise<Jornada> {
    const saved = await this.repository.save(this.mapToOrm(jornada));
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Jornada | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<Jornada[]> {
    const all = await this.repository.find({ order: { name: 'ASC' } });
    return all.map((o) => this.mapToDomain(o));
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id as any } }); if (entity) { await this.repository.remove(entity); } else { await this.repository.delete(id); }
  }
}

