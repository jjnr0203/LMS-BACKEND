import { TeacherSubjectRepositoryPort } from '../../ports/outbound/academic/teacher-subject-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { NotFoundException } from '@nestjs/common';

export class UnassignTeacherUseCase {
  constructor(
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly teacherSubjectRepository: TeacherSubjectRepositoryPort,
  ) {}

  async execute(subjectId: string, curriculumId?: string): Promise<void> {
    const subject = await this.subjectRepository.findById(subjectId);
    if (!subject) {
      throw new NotFoundException('Materia no encontrada');
    }

    const existing = await this.teacherSubjectRepository.findBySubjectId(
      subjectId,
      curriculumId,
    );
    if (existing.length === 0) {
      throw new NotFoundException(
        'No hay docente asignado a esta materia',
      );
    }

    await this.teacherSubjectRepository.deleteBySubjectId(
      subjectId,
      curriculumId,
    );
  }
}
