import {
  CreateUserUseCasePort,
  CreateUserCommand,
} from '../../ports/inbound/admin/create-user.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { UserEntity } from '../../entities/users/user.entity';
import { BadRequestException } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

export class CreateUserUseCase implements CreateUserUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly mailerService: MailerService,
  ) {}

  async execute(command: CreateUserCommand): Promise<{ user: UserEntity }> {
    const existingById = await this.userRepository.findById(command.id);
    if (existingById && !existingById.deletedAt) {
      throw new BadRequestException('Ya existe un usuario con esta cédula');
    }

    const existingByEmail = await this.userRepository.findByEmail(
      command.email,
    );
    if (
      existingByEmail &&
      (!existingByEmail.deletedAt || existingByEmail.id !== command.id)
    ) {
      throw new BadRequestException('Ya existe un usuario con este email');
    }

    const role = await this.roleRepository.findByName(command.roleName);
    if (!role) {
      throw new BadRequestException(`El rol ${command.roleName} no existe`);
    }

    // Auto-generate password using the cedula (id)
    const passwordHash = await this.passwordHasher.hash(command.id);

    const user = new UserEntity(
      command.id,
      command.firstName,
      command.lastName,
      command.email,
      passwordHash,
      role.id,
      true,
      command.birthDate,
      command.phone,
      undefined, // avatarUrl
      undefined, // createdAt
      undefined, // updatedAt
      null, // deletedAt (null to restore soft-deleted users)
      role.name,
      true, // requiresPasswordChange = true
    );

    const savedUser = await this.userRepository.save(user);

    // Send welcome email
    try {
      await this.mailerService.sendMail({
        to: command.email,
        subject: 'Tus credenciales de acceso - Sistema Académico',
        template: 'welcome',
        context: {
          firstName: command.firstName,
          lastName: command.lastName,
          id: command.id,
          loginUrl: process.env.FRONTEND_URL || 'http://localhost:4200/login',
        },
      });
    } catch (error) {
      console.error('Error sending welcome email', error);
      // We don't fail the user creation if email fails, but we log it
    }

    return { user: savedUser };
  }
}
