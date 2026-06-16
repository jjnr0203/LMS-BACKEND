import {
  RegisterUseCasePort,
  RegisterCommand,
} from '../../ports/inbound/auth/register.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { UserEntity } from '../../entities/users/user.entity';
import { BadRequestException } from '@nestjs/common';

export class RegisterUseCase implements RegisterUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: RegisterCommand): Promise<{ user: UserEntity }> {
    // Check if user exists by id (cedula)
    const existingById = await this.userRepository.findById(command.id);
    if (existingById) {
      throw new BadRequestException('Ya existe un usuario con esta cédula');
    }

    // Check if user exists by email
    const existingByEmail = await this.userRepository.findByEmail(
      command.email,
    );
    if (existingByEmail) {
      throw new BadRequestException('Ya existe un usuario con este email');
    }

    // Get role
    const role = await this.roleRepository.findByName(command.roleName);
    if (!role) {
      throw new BadRequestException(`El rol ${command.roleName} no existe`);
    }

    // Hash password
    const passwordHash = await this.passwordHasher.hash(command.passwordRaw);

    // Create user
    const user = new UserEntity(
      command.id,
      command.firstName,
      command.lastName,
      command.email,
      passwordHash,
      role.id,
      true, // isActive
    );

    const savedUser = await this.userRepository.save(user);

    return { user: savedUser };
  }
}
