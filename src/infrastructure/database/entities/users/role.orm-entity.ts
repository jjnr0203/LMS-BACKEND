import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from '../../../../domain/entities/users/role.entity';

@Entity('roles')
export class RoleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  static toDomain(ormEntity: RoleOrmEntity): RoleEntity {
    return new RoleEntity(ormEntity.id, ormEntity.name, ormEntity.description);
  }
}
