import { RoleEntity } from '../../../entities/users/role.entity';

export abstract class RoleRepositoryPort {
  abstract findById(id: string): Promise<RoleEntity | null>;
  abstract findByName(name: string): Promise<RoleEntity | null>;
  abstract findAll(): Promise<RoleEntity[]>;
}
