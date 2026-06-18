import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnrollmentRepositoryPort } from '@domain/ports/outbound/academic/enrollment-repository.port';
import { EnrollmentEntity } from '@domain/entities/academic/enrollment.entity';
import { EnrollmentOrmEntity } from '../../../database/entities/academic/enrollment.orm-entity';

@Injectable()
export class EnrollmentPostgresRepository implements EnrollmentRepositoryPort {
  constructor(
    @InjectRepository(EnrollmentOrmEntity)
    private readonly repository: Repository<EnrollmentOrmEntity>,
  ) {}

  async findById(id: string): Promise<EnrollmentEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByStudentId(studentId: string): Promise<EnrollmentEntity | null> {
    const orm = await this.repository.findOne({ where: { studentId } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(enrollment: EnrollmentEntity): Promise<EnrollmentEntity> {
    const orm = this.toOrm(enrollment);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async findAll(): Promise<EnrollmentEntity[]> {
    const orms = await this.repository.find();
    return orms.map((o) => this.toDomain(o));
  }

  private toDomain(orm: EnrollmentOrmEntity): EnrollmentEntity {
    return new EnrollmentEntity(orm.id, orm.studentId, orm.enrolledAt);
  }

  private toOrm(entity: EnrollmentEntity): EnrollmentOrmEntity {
    const orm = new EnrollmentOrmEntity();
    orm.id = entity.id;
    orm.studentId = entity.studentId;
    orm.enrolledAt = entity.enrolledAt;
    return orm;
  }
}
