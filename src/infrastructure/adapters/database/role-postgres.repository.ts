import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { RoleEntity } from '@domain/entities/users/role.entity';
import { RoleOrmEntity } from '@infrastructure/database/entities/users/role.orm-entity';

@Injectable()
export class RolePostgresRepository implements RoleRepositoryPort {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repository: Repository<RoleOrmEntity>,
  ) {}

  async findById(id: string): Promise<RoleEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? RoleOrmEntity.toDomain(ormEntity) : null;
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const ormEntity = await this.repository.findOne({ where: { name } });
    return ormEntity ? RoleOrmEntity.toDomain(ormEntity) : null;
  }
}
