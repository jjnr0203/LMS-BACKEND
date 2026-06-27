import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, In } from 'typeorm';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { UserEntity } from '@domain/entities/users/user.entity';
import { UserOrmEntity } from '../../database/entities/users/user.orm-entity';

@Injectable()
export class UserPostgresRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntity ? UserOrmEntity.toDomain(ormEntity) : null;
  }

  async findByIds(ids: string[]): Promise<UserEntity[]> {
    if (ids.length === 0) return [];
    const ormEntities = await this.repository.find({
      where: { id: In(ids) },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntities.map((e) => UserOrmEntity.toDomain(e));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const ormEntity = await this.repository.findOne({
      where: { email },
      withDeleted: true,
      relations: ['role'],
    });
    return ormEntity ? UserOrmEntity.toDomain(ormEntity) : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const ormEntity = UserOrmEntity.fromDomain(user);
    const saved = await this.repository.save(ormEntity);
    return UserOrmEntity.toDomain(saved);
  }

  async findPaginated(
    page: number,
    limit: number,
    role?: string,
    search?: string,
  ): Promise<{ data: UserEntity[]; total: number }> {
    const qb = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.deletedAt IS NULL'); // Since withDeleted is not used here but it's handled by TypeORM soft deletes automatically, but just in case, TypeORM does it by default. Actually, we just don't need to specify deletedAt if TypeORM does it automatically unless we use withDeleted.

    if (role) {
      qb.andWhere('role.name = :role', { role });
    }

    if (search) {
      qb.andWhere(
        new Brackets((qbInner) => {
          qbInner
            .where('user.id ILIKE :search', { search: `%${search}%` })
            .orWhere('user.firstName ILIKE :search', { search: `%${search}%` })
            .orWhere('user.lastName ILIKE :search', { search: `%${search}%` })
            .orWhere('role.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    qb.orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [ormEntities, total] = await qb.getManyAndCount();
    return { data: ormEntities.map((e) => UserOrmEntity.toDomain(e)), total };
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async getCountsByRole(): Promise<Record<string, number>> {
    const counts = await this.repository
      .createQueryBuilder('user')
      .innerJoin('user.role', 'role')
      .where('user.deletedAt IS NULL')
      .select('role.name', 'roleName')
      .addSelect('COUNT(user.id)', 'count')
      .groupBy('role.name')
      .getRawMany();

    const result: Record<string, number> = {};
    for (const row of counts) {
      result[row.roleName] = parseInt(row.count, 10);
    }
    return result;
  }
}
