import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissionRepositoryPort } from '@domain/ports/outbound/academic/role-permission-repository.port';
import { RolePermissionOrmEntity } from '../../../database/entities/academic/role-permission.orm-entity';
import { RolePermission } from '@domain/entities/academic/role-permission.entity';

@Injectable()
export class RolePermissionPostgresRepository implements RolePermissionRepositoryPort {
  constructor(
    @InjectRepository(RolePermissionOrmEntity)
    private readonly repository: Repository<RolePermissionOrmEntity>,
  ) {}

  private mapToDomain(orm: RolePermissionOrmEntity): RolePermission {
    return new RolePermission(orm.roleId, orm.permissionId);
  }

  async save(rp: RolePermission): Promise<RolePermission> {
    const saved = await this.repository.save({
      roleId: rp.roleId,
      permissionId: rp.permissionId,
    });
    return this.mapToDomain(saved);
  }

  async findByRole(roleId: string): Promise<RolePermission[]> {
    const rows = await this.repository.find({ where: { roleId } });
    return rows.map((r) => this.mapToDomain(r));
  }

  async findByPermission(permissionId: string): Promise<RolePermission[]> {
    const rows = await this.repository.find({ where: { permissionId } });
    return rows.map((r) => this.mapToDomain(r));
  }

  async delete(roleId: string, permissionId: string): Promise<void> {
    await this.repository.delete({ roleId, permissionId });
  }

  async deleteByRole(roleId: string): Promise<void> {
    await this.repository.delete({ roleId });
  }

  async exists(roleId: string, permissionId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { roleId, permissionId },
    });
    return count > 0;
  }
}
