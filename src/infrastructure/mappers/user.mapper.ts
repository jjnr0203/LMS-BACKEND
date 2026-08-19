import { UserEntity } from '@domain/entities/users/user.entity';
import { UserOrmEntity } from '../database/entities/users/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): UserEntity {
    return new UserEntity(
      orm.id,
      orm.firstName,
      orm.lastName,
      orm.email,
      orm.password,
      orm.roleId,
      orm.isActive,
      orm.birthDate,
      orm.phone,
      orm.avatarUrl,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
      undefined, // roleName
      undefined, // faculties
      undefined, // requiresPasswordChange
      orm.address,
      orm.linkedIn,
      orm.cvUrl,
      orm.certificates,
    );
  }

  static toOrm(entity: UserEntity): UserOrmEntity {
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
    orm.address = entity.address;
    orm.linkedIn = entity.linkedIn;
    orm.cvUrl = entity.cvUrl;
    orm.certificates = entity.certificates;
    orm.deletedAt = entity.deletedAt;
    return orm;
  }

  static toSafeResponse(entity: UserEntity): Record<string, unknown> {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      roleId: entity.roleId,
      isActive: entity.isActive,
      birthDate: entity.birthDate,
      phone: entity.phone,
      avatarUrl: entity.avatarUrl,
      address: entity.address,
      linkedIn: entity.linkedIn,
      cvUrl: entity.cvUrl,
      certificates: entity.certificates,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
