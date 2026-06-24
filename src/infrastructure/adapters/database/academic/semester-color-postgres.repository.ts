import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SemesterColorRepositoryPort } from '../../../../domain/ports/outbound/academic/semester-color-repository.port';
import { SemesterColorOrmEntity } from '../../../database/entities/academic/semester-color.orm-entity';

@Injectable()
export class SemesterColorPostgresRepository implements SemesterColorRepositoryPort {
  constructor(
    @InjectRepository(SemesterColorOrmEntity)
    private readonly repository: Repository<SemesterColorOrmEntity>,
  ) {}

  async findAll(): Promise<{ semester: number; color: string }[]> {
    const colors = await this.repository.find();
    return colors.map((c) => ({ semester: c.semester, color: c.color }));
  }

  async save(semester: number, color: string): Promise<void> {
    let entity = await this.repository.findOne({ where: { semester } });
    if (!entity) {
      entity = this.repository.create({ semester, color });
    } else {
      entity.color = color;
    }
    await this.repository.save(entity);
  }
}
