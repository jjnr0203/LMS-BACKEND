import { Permission } from '../../../entities/academic/permission.entity';

export const PERMISSION_REPOSITORY = Symbol('PERMISSION_REPOSITORY');

export interface PermissionRepositoryPort {
  save(permission: Permission): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findByCode(code: string): Promise<Permission | null>;
  findAll(): Promise<Permission[]>;
  delete(id: string): Promise<void>;
}
