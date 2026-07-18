import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { InscriptionEntity } from '@domain/entities/secretary/inscription.entity';
import { InscriptionOrmEntity } from '../../../database/entities/secretary/inscription.orm-entity';

@Injectable()
export class InscriptionPostgresRepository implements InscriptionRepositoryPort {
  constructor(
    @InjectRepository(InscriptionOrmEntity)
    private readonly repository: Repository<InscriptionOrmEntity>,
  ) {}

  async findById(id: string): Promise<InscriptionEntity | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? InscriptionOrmEntity.toDomain(orm) : null;
  }

  async findByStudentId(studentId: string): Promise<InscriptionEntity[]> {
    const orms = await this.repository.find({ where: { studentId } });
    return orms.map(InscriptionOrmEntity.toDomain);
  }

  async save(inscription: InscriptionEntity): Promise<InscriptionEntity> {
    const orm = InscriptionOrmEntity.fromDomain(inscription);
    const saved = await this.repository.save(orm);
    return InscriptionOrmEntity.toDomain(saved);
  }

  async findAll(): Promise<InscriptionEntity[]> {
    const orms = await this.repository.find({ relations: ['student', 'career'] });
    return orms.map(InscriptionOrmEntity.toDomain);
  }

  async findAllWithDetails(): Promise<any[]> {
    const orms = await this.repository.find({ relations: ['student', 'career'] });
    return orms.map((orm) => ({
      id: orm.id,
      studentId: orm.studentId,
      studentFirstName: orm.student?.firstName ?? '',
      studentLastName: orm.student?.lastName ?? '',
      careerId: orm.careerId,
      careerName: orm.career?.name ?? '',
      status: orm.status,
      documentUrl: orm.documentUrl,
      notes: orm.notes,
      createdAt: orm.createdAt,
    }));
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.repository.update(id, { status });
  }
}
