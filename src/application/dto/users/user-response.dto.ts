import { UserEntity } from '../../../domain/entities/users/user.entity';

export class UserResponseDto {
  static fromEntity(user: UserEntity) {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
