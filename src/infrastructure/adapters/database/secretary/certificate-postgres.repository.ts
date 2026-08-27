import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificateRepositoryPort } from '@domain/ports/outbound/secretary/certificate-repository.port';
import { CertificateEntity } from '@domain/entities/secretary/certificate.entity';
import { CertificateOrmEntity } from '../../../database/entities/secretary/certificate.orm-entity';

@Injectable()
export class CertificatePostgresRepository implements CertificateRepositoryPort {
  constructor(
    @InjectRepository(CertificateOrmEntity)
    private readonly repository: Repository<CertificateOrmEntity>,
  ) {}

  async findById(id: string): Promise<CertificateEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? CertificateOrmEntity.toDomain(orm) : null;
  }

  async findByStudentId(studentId: string): Promise<CertificateEntity[]> {
    const orms = await this.repository.find({ where: { studentId } });
    return orms.map(CertificateOrmEntity.toDomain);
  }

  async findAll(): Promise<CertificateEntity[]> {
    const orms = await this.repository.find();
    return orms.map(CertificateOrmEntity.toDomain);
  }

  async save(certificate: CertificateEntity): Promise<CertificateEntity> {
    const orm = CertificateOrmEntity.fromDomain(certificate);
    const saved = await this.repository.save(orm);
    return CertificateOrmEntity.toDomain(saved);
  }
}
