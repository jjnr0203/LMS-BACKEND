import {
  DisableAccountUseCasePort,
  DisableAccountCommand,
  DisableAccountResult,
} from '../../ports/inbound/treasury/disable-account.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { UserEntity } from '../../entities/users/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class DisableAccountUseCase implements DisableAccountUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly tuitionRepository: TuitionRepositoryPort,
  ) {}

  async execute(command: DisableAccountCommand): Promise<DisableAccountResult> {
    const tuition = await this.tuitionRepository.findByStudentId(
      command.studentId,
    );
    if (!tuition) {
      throw new NotFoundException(
        'Registro de matrícula no encontrado para este estudiante',
      );
    }

    if (tuition.status !== 'no_paga') {
      throw new BadRequestException(
        'Solo se pueden deshabilitar cuentas con estado no_paga',
      );
    }

    const user = await this.userRepository.findById(command.studentId);
    if (!user) {
      throw new NotFoundException('Usuario estudiante no encontrado');
    }

    if (!user.isActive) {
      throw new BadRequestException('La cuenta ya se encuentra deshabilitada');
    }

    const updatedUser = new UserEntity(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.passwordHash,
      user.roleId,
      false,
      user.birthDate,
      user.phone,
      user.avatarUrl,
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );

    const savedUser = await this.userRepository.save(updatedUser);

    return { user: savedUser, tuition };
  }
}
