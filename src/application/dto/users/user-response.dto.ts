import { UserEntity } from '@domain/entities/users/user.entity';

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  isActive: boolean;
  birthDate: Date | null;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export function mapUserToResponse(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roleId: user.roleId,
    isActive: user.isActive,
    birthDate: user.birthDate ?? null,
    phone: user.phone ?? null,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt!,
    updatedAt: user.updatedAt!,
    deletedAt: user.deletedAt ?? null,
  };
}
