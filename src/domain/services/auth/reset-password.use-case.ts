import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(dto: { token: string; password: string }): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const user = await this.userRepository.findByResetToken(tokenHash);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires.getTime() < Date.now()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const newPasswordHash = await this.passwordHasher.hash(dto.password);

    const updatedUser = Object.assign(Object.create(Object.getPrototypeOf(user)), user, {
      passwordHash: newPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      requiresPasswordChange: false // User just set a new password, so it's not required anymore
    });

    await this.userRepository.save(updatedUser);

    return { message: 'Contraseña actualizada exitosamente' };
  }
}
