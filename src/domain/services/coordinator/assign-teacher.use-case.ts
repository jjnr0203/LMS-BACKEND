import {
  AssignTeacherUseCasePort,
  AssignTeacherCommand,
} from '../../ports/inbound/coordinator/assign-teacher.use-case.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class AssignTeacherUseCase implements AssignTeacherUseCasePort {
  constructor(
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(command: AssignTeacherCommand): Promise<void> {
    const subject = await this.subjectRepository.findById(command.subjectId);
    if (!subject) {
      throw new NotFoundException('Materia no encontrada');
    }

    const teacher = await this.userRepository.findById(command.teacherId);
    if (!teacher) {
      throw new NotFoundException('Docente no encontrado');
    }

    // Assign teacher by updating subject's coordinator (in a real system, might have a separate field)
    // For now, we track assignments via the student_subjects table in the teacher flow
    throw new BadRequestException(
      'Use el endpoint del docente para asignar estudiantes a materias',
    );
  }
}
