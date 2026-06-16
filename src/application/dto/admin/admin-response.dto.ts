import { UserEntity } from '../../../domain/entities/users/user.entity';

export class AdminResponseDto {
  static fromEntity(user: UserEntity) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
