import {
  RegisterTeacherUseCasePort,
  RegisterTeacherCommand,
} from '../../ports/inbound/coordinator/register-teacher.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { UserEntity } from '../../entities/users/user.entity';
import { BadRequestException } from '@nestjs/common';

export class RegisterTeacherUseCase implements RegisterTeacherUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(
    command: RegisterTeacherCommand,
  ): Promise<{ user: UserEntity }> {
    const existingById = await this.userRepository.findById(command.id);
    if (existingById) {
      throw new BadRequestException('Ya existe un usuario con esta cédula');
    }

    const existingByEmail = await this.userRepository.findByEmail(
      command.email,
    );
    if (existingByEmail) {
      throw new BadRequestException('Ya existe un usuario con este email');
    }

    const role = await this.roleRepository.findByName('docente');
    if (!role) {
      throw new BadRequestException('El rol docente no existe');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = new UserEntity(
      command.id,
      command.firstName,
      command.lastName,
      command.email,
      passwordHash,
      role.id,
      true,
    );

    const savedUser = await this.userRepository.save(user);
    return { user: savedUser };
  }
}
