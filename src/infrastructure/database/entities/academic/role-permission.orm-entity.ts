import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoleOrmEntity } from '../users/role.orm-entity';
import { PermissionOrmEntity } from './permission.orm-entity';

@Entity('role_permissions')
export class RolePermissionOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @PrimaryColumn({ type: 'uuid', name: 'permission_id' })
  permissionId: string;

  @ManyToOne(() => RoleOrmEntity)
  @JoinColumn({ name: 'role_id' })
  role?: RoleOrmEntity;

  @ManyToOne(() => PermissionOrmEntity)
  @JoinColumn({ name: 'permission_id' })
  permission?: PermissionOrmEntity;
}
