import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CurriculumRepositoryPort } from '@domain/ports/outbound/academic/curriculum-repository.port';
import { CurriculumOrmEntity } from '../../../database/entities/academic/curriculum.orm-entity';
import { Curriculum } from '@domain/entities/academic/curriculum.entity';

@Injectable()
export class CurriculumPostgresRepository implements CurriculumRepositoryPort {
  constructor(
    @InjectRepository(CurriculumOrmEntity)
    private readonly repository: Repository<CurriculumOrmEntity>,
  ) {}

  private toDomain(orm: CurriculumOrmEntity): Curriculum {
    return new Curriculum(
      orm.id,
      orm.careerId,
      orm.name,
      orm.description,
      orm.isActive,
      orm.createdAt,
    );
  }

  private toOrm(entity: Curriculum): CurriculumOrmEntity {
    const orm = new CurriculumOrmEntity();
    orm.id = entity.id;
    orm.careerId = entity.careerId;
    orm.name = entity.name;
    orm.description = entity.description;
    orm.isActive = entity.isActive;
    orm.createdAt = entity.createdAt;
    return orm;
  }

  async save(curriculum: Curriculum): Promise<Curriculum> {
    const saved = await this.repository.save(this.toOrm(curriculum));
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Curriculum | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? this.toDomain(found) : null;
  }

  async findByCareer(careerId: string): Promise<Curriculum[]> {
    const found = await this.repository.find({
      where: { careerId },
      order: { createdAt: 'DESC' },
    });
    return found.map((o) => this.toDomain(o));
  }

  async findByCareerIds(careerIds: string[]): Promise<Curriculum[]> {
    if (careerIds.length === 0) return [];
    const found = await this.repository.find({
      where: { careerId: In(careerIds) },
      order: { createdAt: 'DESC' },
    });
    return found.map((o) => this.toDomain(o));
  }

  async delete(id: string): Promise<void> {
    const entity = await this.repository.findOne({ where: { id: id as any } }); if (entity) { await this.repository.remove(entity); } else { await this.repository.delete(id); }
  }
}

