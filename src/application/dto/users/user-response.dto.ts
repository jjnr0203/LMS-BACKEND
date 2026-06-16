import { UserEntity } from '../../../domain/entities/users/user.entity';

export class UserResponseDto {
  static fromEntity(user: UserEntity) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
