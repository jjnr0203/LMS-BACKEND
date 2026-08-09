import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { StudentEntity } from '@domain/entities/users/student.entity';
import { StudentOrmEntity } from '../../../../../infrastructure/database/entities/users/student.orm-entity';

@Injectable()
export class StudentPostgresRepository implements StudentRepositoryPort {
  constructor(
    @InjectRepository(StudentOrmEntity)
    private readonly repository: Repository<StudentOrmEntity>,
  ) {}

  async findById(id: string): Promise<StudentEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      withDeleted: true,
    });
    return ormEntity ? StudentOrmEntity.toDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<StudentEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { email },
      withDeleted: true,
    });
    return ormEntity ? StudentOrmEntity.toDomain(ormEntity) : null;
  }

  async findByIds(ids: string[]): Promise<StudentEntity[]> {
    if (!ids || ids.length === 0) return [];

    // @ts-ignore - TypeORM requires string[] to be casted to any for In() in older versions,
    // or we can use query builder to avoid In() type issues. Let's use query builder.
    const ormEntities = await this.repository
      .createQueryBuilder('student')
      .where('student.id IN (:...ids)', { ids })
      .andWhere('student.deletedAt IS NULL')
      .getMany();

    return ormEntities.map((e) => StudentOrmEntity.toDomain(e));
  }

  async save(student: StudentEntity): Promise<StudentEntity> {
    const ormEntity = StudentOrmEntity.fromDomain(student);
    const saved = await this.repository.save(ormEntity);
    return StudentOrmEntity.toDomain(saved);
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: StudentEntity[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder('student')
      .where('student.deletedAt IS NULL');

    if (search) {
      qb.andWhere(
        new Brackets((qbInner) => {
          qbInner
            .where('student.id ILIKE :search', { search: `%${search}%` })
            .orWhere('student.firstName ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('student.lastName ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    qb.orderBy('student.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [ormEntities, total] = await qb.getManyAndCount();
    return {
      data: ormEntities.map((e) => StudentOrmEntity.toDomain(e)),
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
