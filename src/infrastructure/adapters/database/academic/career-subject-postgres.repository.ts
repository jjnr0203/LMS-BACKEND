import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareerSubjectRepositoryPort } from '@domain/ports/outbound/academic/career-subject-repository.port';
import { CareerSubjectOrmEntity } from '../../../database/entities/academic/career-subject.orm-entity';
import { CareerSubject } from '@domain/entities/academic/career-subject.entity';

@Injectable()
export class CareerSubjectPostgresRepository implements CareerSubjectRepositoryPort {
  constructor(
    @InjectRepository(CareerSubjectOrmEntity)
    private readonly repository: Repository<CareerSubjectOrmEntity>,
  ) {}

  private mapToDomain(ormEntity: CareerSubjectOrmEntity): CareerSubject {
    return new CareerSubject(
      ormEntity.id,
      ormEntity.careerId,
      ormEntity.subjectId,
      ormEntity.semester,
    );
  }

  private mapToOrm(domainEntity: CareerSubject): CareerSubjectOrmEntity {
    const ormEntity = new CareerSubjectOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.careerId = domainEntity.careerId;
    ormEntity.subjectId = domainEntity.subjectId;
    ormEntity.semester = domainEntity.semester;
    return ormEntity;
  }

  async save(careerSubject: CareerSubject): Promise<CareerSubject> {
    const saved = await this.repository.save(this.mapToOrm(careerSubject));
    return this.mapToDomain(saved);
  }

  async deleteByCareerAndSubject(careerId: string, subjectId: string): Promise<void> {
    await this.repository.delete({ careerId, subjectId });
  }

  async findByCareer(careerId: string): Promise<CareerSubject[]> {
    const found = await this.repository.find({ where: { careerId }, relations: ['subject'] });
    return found.map(f => this.mapToDomain(f));
  }
}
