import { UserEntity } from '@domain/entities/users/user.entity';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  birthDate?: Date;
  phone?: string;
  avatarUrl?: string;
  createdAt?: Date;
  roleName?: string;
  faculties?: { id: string; name?: string }[];
  requiresPasswordChange?: boolean;
  address?: string;
  linkedIn?: string;
  cvUrl?: string | null;
  certificates: string[];

  static fromEntity(entity: UserEntity): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = entity.id;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.email = entity.email;
    dto.isActive = entity.isActive;
    dto.birthDate = entity.birthDate;
    dto.phone = entity.phone;
    dto.avatarUrl = entity.avatarUrl;
    dto.createdAt = entity.createdAt;
    dto.roleName = entity.roleName;
    dto.faculties = entity.faculties;
    dto.requiresPasswordChange = entity.requiresPasswordChange;
    dto.address = entity.address;
    dto.linkedIn = entity.linkedIn;
    dto.cvUrl = entity.cvUrl;
    dto.certificates = entity.certificates;
    return dto;
  }
}
