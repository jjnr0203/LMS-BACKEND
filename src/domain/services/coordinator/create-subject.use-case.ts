import {
  CreateSubjectUseCasePort,
  CreateSubjectCommand,
} from '../../ports/inbound/coordinator/create-subject.use-case.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { SubjectEntity } from '../../entities/academic/subject.entity';
import { BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export class CreateSubjectUseCase implements CreateSubjectUseCasePort {
  constructor(private readonly subjectRepository: SubjectRepositoryPort) {}

  async execute(
    command: CreateSubjectCommand,
  ): Promise<{ subject: SubjectEntity }> {
    const existingByCode = await this.subjectRepository.findByCode(
      command.code,
    );
    if (existingByCode) {
      throw new BadRequestException('Ya existe una materia con este código');
    }

    const subject = new SubjectEntity(
      crypto.randomUUID(),
      command.name,
      command.code,
      command.credits,
      [],
      command.teacherId,
      command.description,
    );

    const savedSubject = await this.subjectRepository.save(subject);
    return { subject: savedSubject };
  }
}
