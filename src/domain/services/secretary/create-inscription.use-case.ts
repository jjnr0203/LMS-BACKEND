import { v4 as uuid } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { CreateInscriptionUseCasePort, CreateInscriptionCommand } from '@domain/ports/inbound/secretary/create-inscription.use-case.port';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { InscriptionEntity } from '@domain/entities/secretary/inscription.entity';
import { StudentEntity } from '@domain/entities/users/student.entity';

export class CreateInscriptionUseCase implements CreateInscriptionUseCasePort {
  constructor(
    private readonly inscriptionRepo: InscriptionRepositoryPort,
    private readonly studentRepo: StudentRepositoryPort,
  ) {}

  async execute(command: CreateInscriptionCommand): Promise<{ inscription: InscriptionEntity }> {
    let student = await this.studentRepo.findById(command.studentId);

    if (!student) {
      const existingByEmail = await this.studentRepo.findByEmail(command.email);
      if (existingByEmail) {
        throw new BadRequestException('Ya existe un estudiante con este correo');
      }

      student = await this.studentRepo.save(
        new StudentEntity(
          command.studentId,
          command.firstName,
          command.lastName,
          command.email,
          true,
        ),
      );
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
