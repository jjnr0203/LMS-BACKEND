import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicRecordRepositoryPort } from '@domain/ports/outbound/secretary/academic-record-repository.port';
import { AcademicRecordEntity } from '@domain/entities/secretary/academic-record.entity';
import { AcademicRecordOrmEntity } from '../../../database/entities/secretary/academic-record.orm-entity';

@Injectable()
export class AcademicRecordPostgresRepository implements AcademicRecordRepositoryPort {
  constructor(
    @InjectRepository(AcademicRecordOrmEntity)
    private readonly repository: Repository<AcademicRecordOrmEntity>,
  ) {}

  async findByStudentId(studentId: string): Promise<AcademicRecordEntity[]> {
    const orms = await this.repository.find({
      where: { studentId },
      relations: ['subject', 'academicTerm'],
    });
    return orms.map(AcademicRecordOrmEntity.toDomain);
  }

  async save(record: AcademicRecordEntity): Promise<AcademicRecordEntity> {
    const orm = AcademicRecordOrmEntity.fromDomain(record);
    const saved = await this.repository.save(orm);
    return AcademicRecordOrmEntity.toDomain(saved);
  }

  async getAverage(studentId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('ar')
      .select('AVG(ar.grade)', 'avg')
      .where('ar.student_id = :studentId', { studentId })
      .andWhere('ar.status = :status', { status: 'approved' })
      .getRawOne();
    return parseFloat(result?.avg) || 0;
  }

  async getTotalCredits(studentId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('ar')
      .select('SUM(ar.credits)', 'total')
      .where('ar.student_id = :studentId', { studentId })
      .andWhere('ar.status = :status', { status: 'approved' })
      .getRawOne();
    return parseInt(result?.total) || 0;
  }
}
