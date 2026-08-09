import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionRepositoryPort } from '@domain/ports/outbound/academic/permission-repository.port';
import { PermissionOrmEntity } from '../../../database/entities/academic/permission.orm-entity';
import { Permission } from '@domain/entities/academic/permission.entity';

@Injectable()
export class PermissionPostgresRepository implements PermissionRepositoryPort {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly repository: Repository<PermissionOrmEntity>,
  ) {}

  private mapToDomain(orm: PermissionOrmEntity): Permission {
    return new Permission(
      orm.id,
      orm.name,
      orm.code,
      orm.description,
      orm.resource,
      orm.createdAt,
    );
  }

  private mapToOrm(domain: Permission): PermissionOrmEntity {
    const orm = new PermissionOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.code = domain.code;
    orm.description = domain.description;
    orm.resource = domain.resource;
    return orm;
  }

  async save(permission: Permission): Promise<Permission> {
    const saved = await this.repository.save(this.mapToOrm(permission));
    return this.mapToDomain(saved);
  }

  async findById(id: string): Promise<Permission | null> {
    const found = await this.repository.findOne({ where: { id } });
    return found ? this.mapToDomain(found) : null;
  }

  async findByCode(code: string): Promise<Permission | null> {
    const found = await this.repository.findOne({ where: { code } });
    return found ? this.mapToDomain(found) : null;
  }

  async findAll(): Promise<Permission[]> {
    const all = await this.repository.find({
      order: { resource: 'ASC', name: 'ASC' },
    });
    return all.map((o) => this.mapToDomain(o));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
