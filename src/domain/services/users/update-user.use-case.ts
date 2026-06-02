import { UpdateUserUseCasePort, UpdateUserCommand } from '../../ports/inbound/users/update-user.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { UserEntity } from '../../entities/users/user.entity';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';

export class UpdateUserUseCase implements UpdateUserUseCasePort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: UpdateUserCommand): Promise<{ user: UserEntity }> {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (command.email && command.email !== user.email) {
      const existing = await this.userRepository.findByEmail(command.email);
      if (existing) {
        throw new BadRequestException('El email ya está en uso');
      }
    }

    const updatedUser = new UserEntity(
      user.id,
      command.firstName ?? user.firstName,
      command.lastName ?? user.lastName,
      command.email ?? user.email,
      user.passwordHash,
      user.roleId,
      user.isActive,
      user.birthDate,
      command.phone ?? user.phone,
      command.avatarUrl ?? user.avatarUrl,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );

    const saved = await this.userRepository.save(updatedUser);
    return { user: saved };
  }
}
