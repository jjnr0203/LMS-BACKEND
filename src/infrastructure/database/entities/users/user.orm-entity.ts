import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '@domain/entities/users/user.entity';
import { RoleOrmEntity } from './role.orm-entity';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Index()
  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => RoleOrmEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleOrmEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  static toDomain(ormEntity: UserOrmEntity): UserEntity {
    return new UserEntity(
      ormEntity.id,
      ormEntity.firstName,
      ormEntity.lastName,
      ormEntity.email,
      ormEntity.password,
      ormEntity.roleId,
      ormEntity.isActive,
      ormEntity.birthDate,
      ormEntity.phone,
      ormEntity.avatarUrl,
      ormEntity.createdAt,
      ormEntity.updatedAt,
      ormEntity.deletedAt,
      ormEntity.role?.name,
    );
  }

  static fromDomain(entity: UserEntity): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = entity.id;
    orm.firstName = entity.firstName;
    orm.lastName = entity.lastName;
    orm.email = entity.email;
    orm.password = entity.passwordHash;
    orm.roleId = entity.roleId;
    orm.isActive = entity.isActive;
    orm.birthDate = entity.birthDate;
    orm.phone = entity.phone;
    orm.avatarUrl = entity.avatarUrl;
    orm.deletedAt = entity.deletedAt;
    return orm;
  }
}
