import { SoftDeleteUserUseCasePort } from '../../ports/inbound/users/soft-delete-user.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { NotFoundException } from '@nestjs/common';

export class SoftDeleteUserUseCase implements SoftDeleteUserUseCasePort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.userRepository.softDelete(id);
  }
}
