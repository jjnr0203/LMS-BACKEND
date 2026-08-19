import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { TeacherRepositoryPort } from '@domain/ports/outbound/users/teacher-repository.port';
import { TeacherEntity } from '@domain/entities/users/teacher.entity';
import { TeacherOrmEntity } from '../../../../../infrastructure/database/entities/users/teacher.orm-entity';

@Injectable()
export class TeacherPostgresRepository implements TeacherRepositoryPort {
  constructor(
    @InjectRepository(TeacherOrmEntity)
    private readonly repository: Repository<TeacherOrmEntity>,
  ) {}

  async findById(id: string): Promise<TeacherEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      relations: ['faculties'],
      withDeleted: true,
    });
    return ormEntity ? TeacherOrmEntity.toDomain(ormEntity) : null;
  }

  async findByIds(ids: string[]): Promise<TeacherEntity[]> {
    if (!ids || ids.length === 0) return [];

    const ormEntities = await this.repository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.faculties', 'faculties')
      .where('teacher.id IN (:...ids)', { ids })
      .andWhere('teacher.deletedAt IS NULL')
      .getMany();

    return ormEntities.map((e) => TeacherOrmEntity.toDomain(e));
  }

  async save(teacher: TeacherEntity): Promise<TeacherEntity> {
    const ormEntity = TeacherOrmEntity.fromDomain(teacher);
    const saved = await this.repository.save(ormEntity);
    return TeacherOrmEntity.toDomain(saved);
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
    facultyIds?: string[],
  ): Promise<{ data: TeacherEntity[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.faculties', 'faculties')
      .where('teacher.deletedAt IS NULL');

    if (search) {
      qb.andWhere(
        new Brackets((qbInner) => {
          qbInner
            .where('teacher.id ILIKE :search', { search: `%${search}%` })
            .orWhere('teacher.firstName ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('teacher.lastName ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (facultyIds && facultyIds.length > 0) {
      qb.andWhere('faculties.id IN (:...facultyIds)', { facultyIds });
    }

    qb.orderBy('teacher.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [ormEntities, total] = await qb.getManyAndCount();
    return {
      data: ormEntities.map((e) => TeacherOrmEntity.toDomain(e)),
      total,
    };
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }
}
