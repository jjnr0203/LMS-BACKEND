import { Permission } from '../../../entities/academic/permission.entity';
import { RolePermission } from '../../../entities/academic/role-permission.entity';
import { PermissionRepositoryPort } from '../../../ports/outbound/academic/permission-repository.port';
import { RolePermissionRepositoryPort } from '../../../ports/outbound/academic/role-permission-repository.port';
import { RoleRepositoryPort } from '../../../ports/outbound/users/role-repository.port';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePermissionDto {
  name: string;
  code: string;
  description?: string;
  resource: string;
}

export class ManagePermissionsUseCase {
  constructor(
    private readonly permissionRepo: PermissionRepositoryPort,
    private readonly rolePermissionRepo: RolePermissionRepositoryPort,
    private readonly roleRepo: RoleRepositoryPort,
  ) {}

  async create(data: CreatePermissionDto): Promise<Permission> {
    const existing = await this.permissionRepo.findByCode(data.code);
    if (existing)
      throw new Error(`Permission with code "${data.code}" already exists`);

    const permission = new Permission(
      uuidv4(),
      data.name,
      data.code,
      data.description || null,
      data.resource,
      new Date(),
    );
    return this.permissionRepo.save(permission);
  }

  async update(
    id: string,
    data: Partial<CreatePermissionDto>,
  ): Promise<Permission | null> {
    const permission = await this.permissionRepo.findById(id);
    if (!permission) return null;

    if (data.name !== undefined) permission.name = data.name;
    if (data.code !== undefined) permission.code = data.code;
    if (data.description !== undefined)
      permission.description = data.description;
    if (data.resource !== undefined) permission.resource = data.resource;

    return this.permissionRepo.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepo.findAll();
  }

  async delete(id: string): Promise<void> {
    const assigned = await this.rolePermissionRepo.findByPermission(id);
    for (const rp of assigned) {
      await this.rolePermissionRepo.delete(rp.roleId, rp.permissionId);
    }
    await this.permissionRepo.delete(id);
  }

  async assignToRole(roleId: string, permissionIds: string[]): Promise<void> {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new Error(`Role "${roleId}" not found`);

    await this.rolePermissionRepo.deleteByRole(roleId);
    for (const permissionId of permissionIds) {
      const rp = new RolePermission(roleId, permissionId);
      await this.rolePermissionRepo.save(rp);
    }
  }

  async getPermissionsByRole(roleId: string): Promise<string[]> {
    const assigned = await this.rolePermissionRepo.findByRole(roleId);
    return assigned.map((rp) => rp.permissionId);
  }

  async getAllRoles(): Promise<{ id: string; name: string }[]> {
    const roles = await this.roleRepo.findAll();
    return roles.map((r) => ({ id: r.id, name: r.name }));
  }
}
