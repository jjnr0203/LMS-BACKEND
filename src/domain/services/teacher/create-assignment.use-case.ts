import {
  CreateAssignmentUseCasePort,
  CreateAssignmentCommand,
} from '../../ports/inbound/teacher/create-assignment.use-case.port';
import { AssignmentRepositoryPort } from '../../ports/outbound/academic/assignment-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { AssignmentEntity } from '../../entities/academic/assignment.entity';
import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

export class CreateAssignmentUseCase implements CreateAssignmentUseCasePort {
  constructor(
    private readonly assignmentRepository: AssignmentRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
  ) {}

  async execute(
    command: CreateAssignmentCommand,
  ): Promise<{ assignment: AssignmentEntity }> {
    const subject = await this.subjectRepository.findById(command.subjectId);
    if (!subject) {
      throw new NotFoundException('Materia no encontrada');
    }

    const assignment = new AssignmentEntity(
      crypto.randomUUID(),
      command.title,
      command.description,
      command.subjectId,
      command.teacherId,
      command.dueDate,
      command.maxScore,
    );

    const savedAssignment = await this.assignmentRepository.save(assignment);
    return { assignment: savedAssignment };
  }
}
