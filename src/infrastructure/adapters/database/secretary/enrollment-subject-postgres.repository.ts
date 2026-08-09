import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentSubjectRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-subject-repository.port';
import { EnrollmentSubjectEntity } from '@domain/entities/secretary/enrollment-subject.entity';
import { EnrollmentSubjectOrmEntity } from '../../../database/entities/secretary/enrollment-subject.orm-entity';

@Injectable()
export class EnrollmentSubjectPostgresRepository implements EnrollmentSubjectRepositoryPort {
  constructor(
    @InjectRepository(EnrollmentSubjectOrmEntity)
    private readonly repository: Repository<EnrollmentSubjectOrmEntity>,
  ) {}

  async findByEnrollmentDetailId(
    enrollmentDetailId: string,
  ): Promise<EnrollmentSubjectEntity[]> {
    const orms = await this.repository.find({ where: { enrollmentDetailId } });
    return orms.map(EnrollmentSubjectOrmEntity.toDomain);
  }

  async save(
    enrollmentSubject: EnrollmentSubjectEntity,
  ): Promise<EnrollmentSubjectEntity> {
    const orm = EnrollmentSubjectOrmEntity.fromDomain(enrollmentSubject);
    const saved = await this.repository.save(orm);
    return EnrollmentSubjectOrmEntity.toDomain(saved);
  }

  async saveMany(
    enrollmentSubjects: EnrollmentSubjectEntity[],
  ): Promise<EnrollmentSubjectEntity[]> {
    const orms = enrollmentSubjects.map(EnrollmentSubjectOrmEntity.fromDomain);
    const saved = await this.repository.save(orms);
    return saved.map(EnrollmentSubjectOrmEntity.toDomain);
  }
}
