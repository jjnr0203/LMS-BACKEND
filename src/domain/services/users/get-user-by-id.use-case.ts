import { GetUserByIdUseCasePort } from '../../ports/inbound/users/get-user-by-id.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { UserEntity } from '../../entities/users/user.entity';
import { NotFoundException } from '@nestjs/common';

export class GetUserByIdUseCase implements GetUserByIdUseCasePort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
