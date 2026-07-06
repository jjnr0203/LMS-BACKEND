import { RolePermission } from '../../../entities/academic/role-permission.entity';

export const ROLE_PERMISSION_REPOSITORY = Symbol('ROLE_PERMISSION_REPOSITORY');

export interface RolePermissionRepositoryPort {
  save(rp: RolePermission): Promise<RolePermission>;
  findByRole(roleId: string): Promise<RolePermission[]>;
  findByPermission(permissionId: string): Promise<RolePermission[]>;
  delete(roleId: string, permissionId: string): Promise<void>;
  deleteByRole(roleId: string): Promise<void>;
  exists(roleId: string, permissionId: string): Promise<boolean>;
}
