import {
  RegisterStudentUseCasePort,
  RegisterStudentCommand,
  RegisterStudentResult,
} from '../../ports/inbound/coordinator/register-student.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { UserEntity } from '../../entities/users/user.entity';
import { TuitionEntity } from '../../entities/academic/tuition.entity';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export class RegisterStudentUseCase implements RegisterStudentUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tuitionRepository: TuitionRepositoryPort,
  ) {}

  async execute(
    command: RegisterStudentCommand,
  ): Promise<RegisterStudentResult> {
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

    const role = await this.roleRepository.findByName('estudiante');
    if (!role) {
      throw new BadRequestException('El rol estudiante no existe');
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

    const tuition = new TuitionEntity(
      crypto.randomUUID(),
      savedUser.id,
      'no_paga',
      0,
    );

    const savedTuition = await this.tuitionRepository.save(tuition);

    return { user: savedUser, tuition: savedTuition };
  }
}
