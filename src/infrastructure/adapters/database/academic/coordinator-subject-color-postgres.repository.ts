import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoordinatorSubjectColorRepositoryPort } from '../../../../domain/ports/outbound/academic/coordinator-subject-color-repository.port';
import { CoordinatorSubjectColorOrmEntity } from '../../../database/entities/academic/coordinator-subject-color.orm-entity';

@Injectable()
export class CoordinatorSubjectColorPostgresRepository implements CoordinatorSubjectColorRepositoryPort {
  constructor(
    @InjectRepository(CoordinatorSubjectColorOrmEntity)
    private readonly repository: Repository<CoordinatorSubjectColorOrmEntity>,
  ) {}

  async findByCoordinatorId(
    coordinatorId: string,
  ): Promise<{ subjectId: string; color: string }[]> {
    const records = await this.repository.find({
      where: { coordinatorId },
    });
    return records.map((r) => ({ subjectId: r.subjectId, color: r.color }));
  }

  async save(
    coordinatorId: string,
    subjectId: string,
    color: string,
  ): Promise<void> {
    const existing = await this.repository.findOne({
      where: { coordinatorId, subjectId },
    });
    if (existing) {
      existing.color = color;
      await this.repository.save(existing);
    } else {
      const newEntity = this.repository.create({
        coordinatorId,
        subjectId,
        color,
      });
      await this.repository.save(newEntity);
    }
  }
}
