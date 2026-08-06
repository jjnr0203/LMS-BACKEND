import {
  UpdatePasswordUseCasePort,
  UpdatePasswordCommand,
} from '../../ports/inbound/users/update-password.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { UserEntity } from '../../entities/users/user.entity';
import { NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';

export class UpdatePasswordUseCase implements UpdatePasswordUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<void> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (command.currentPassword) {
      const isMatch = await this.passwordHasher.compare(
        command.currentPassword,
        user.passwordHash,
      );
      if (!isMatch) {
        throw new BadRequestException('La contraseña actual es incorrecta');
      }
    }

    const newPasswordHash = await this.passwordHasher.hash(command.newPassword);

    const updatedUser = new UserEntity(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      newPasswordHash,
      user.roleId,
      user.isActive,
      user.birthDate,
      user.phone,
      user.avatarUrl,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
      user.roleName,
      user.faculties,
      false, // requiresPasswordChange
    );

    await this.userRepository.save(updatedUser);
  }
}
