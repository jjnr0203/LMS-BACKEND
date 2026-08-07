import { UserEntity } from '@domain/entities/users/user.entity';

export class AdminResponseDto {
  static fromEntity(user: UserEntity) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleId: user.roleId,
      roleName: user.roleName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      avatarUrl: (user as any).avatarUrl,
      cvUrl: (user as any).cvUrl,
      certificates: (user as any).certificates,
      linkedIn: (user as any).linkedIn,
      address: (user as any).address,
      phone: user.phone,
      birthDate: user.birthDate,
    };
  }
}
