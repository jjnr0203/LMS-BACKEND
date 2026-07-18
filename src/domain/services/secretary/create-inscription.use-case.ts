import { v4 as uuid } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { CreateInscriptionUseCasePort, CreateInscriptionCommand } from '@domain/ports/inbound/secretary/create-inscription.use-case.port';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { InscriptionEntity } from '@domain/entities/secretary/inscription.entity';
import { UserEntity } from '@domain/entities/users/user.entity';

export class CreateInscriptionUseCase implements CreateInscriptionUseCasePort {
  constructor(
    private readonly inscriptionRepo: InscriptionRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
    private readonly roleRepo: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: CreateInscriptionCommand): Promise<{ inscription: InscriptionEntity }> {
    let student = await this.userRepo.findById(command.studentId);

    if (!student) {
      const studentRole = await this.roleRepo.findByName('student');
      if (!studentRole) {
        throw new BadRequestException('El rol estudiante no existe en el sistema');
      }

      const existingByEmail = await this.userRepo.findByEmail(command.email);
      if (existingByEmail) {
        throw new BadRequestException('Ya existe un usuario con este correo');
      }

      const passwordHash = await this.passwordHasher.hash(command.password);
      const newStudent = new UserEntity(
        command.studentId,
        command.firstName,
        command.lastName,
        command.email,
        passwordHash,
        studentRole.id,
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'student',
      );
      student = await this.userRepo.save(newStudent);
    }

    const existing = await this.inscriptionRepo.findByStudentId(command.studentId);
    const pending = existing.find(i => i.status === 'pending' && i.careerId === command.careerId);
    if (pending) {
      throw new BadRequestException('El estudiante ya tiene una inscripción pendiente para esta carrera');
    }

    const inscription = new InscriptionEntity(
      uuid(),
      command.studentId,
      command.careerId,
      'pending',
      undefined,
      command.notes,
    );

    const saved = await this.inscriptionRepo.save(inscription);
    return { inscription: saved };
  }
}
