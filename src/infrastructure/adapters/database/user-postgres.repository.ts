import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ): Promise<{ data: UserEntity[]; total: number }> {
    const whereClause = role ? { role: { name: role } } : {};
    const [ormEntities, total] = await this.repository.findAndCount({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['role'],
    });
    return { data: ormEntities.map((e) => UserOrmEntity.toDomain(e)), total };
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
