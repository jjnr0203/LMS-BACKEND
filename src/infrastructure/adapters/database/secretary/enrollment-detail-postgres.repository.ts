import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentDetailRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-detail-repository.port';
import { EnrollmentDetailEntity } from '@domain/entities/secretary/enrollment-detail.entity';
import { EnrollmentDetailOrmEntity } from '../../../database/entities/secretary/enrollment-detail.orm-entity';

@Injectable()
export class EnrollmentDetailPostgresRepository implements EnrollmentDetailRepositoryPort {
  constructor(
    @InjectRepository(EnrollmentDetailOrmEntity)
    private readonly repository: Repository<EnrollmentDetailOrmEntity>,
  ) {}

  async findById(id: string): Promise<EnrollmentDetailEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? EnrollmentDetailOrmEntity.toDomain(orm) : null;
  }

  async findByStudentAndTerm(
    studentId: string,
    academicTermId: string,
  ): Promise<EnrollmentDetailEntity | null> {
    const orm = await this.repository.findOne({
      where: { studentId, academicTermId },
    });
    return orm ? EnrollmentDetailOrmEntity.toDomain(orm) : null;
  }

  async save(
    enrollment: EnrollmentDetailEntity,
  ): Promise<EnrollmentDetailEntity> {
    const orm = EnrollmentDetailOrmEntity.fromDomain(enrollment);
    const saved = await this.repository.save(orm);
    return EnrollmentDetailOrmEntity.toDomain(saved);
  }

  async findByStudentId(studentId: string): Promise<EnrollmentDetailEntity[]> {
    const orms = await this.repository.find({ where: { studentId } });
    return orms.map(EnrollmentDetailOrmEntity.toDomain);
  }
}
