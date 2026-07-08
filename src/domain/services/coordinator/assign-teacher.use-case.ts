import {
  AssignTeacherUseCasePort,
  AssignTeacherCommand,
} from '../../ports/inbound/coordinator/assign-teacher.use-case.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { TeacherSubjectRepositoryPort } from '../../ports/outbound/academic/teacher-subject-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { TeacherSubjectEntity } from '../../entities/academic/teacher-subject.entity';
import { NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

export class AssignTeacherUseCase implements AssignTeacherUseCasePort {
  constructor(
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly teacherSubjectRepository: TeacherSubjectRepositoryPort,
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

    const existing = await this.teacherSubjectRepository.findBySubjectId(
      command.subjectId,
      command.curriculumId,
    );
    if (existing.length > 0) {
      await this.teacherSubjectRepository.deleteBySubjectId(
        command.subjectId,
        command.curriculumId,
      );
    }

    const relation = new TeacherSubjectEntity(
      crypto.randomUUID(),
      command.teacherId,
      command.subjectId,
      new Date(),
      command.curriculumId,
      command.academicTermId,
      command.modalityId,
      command.jornadaId,
    );

    await this.teacherSubjectRepository.save(relation);
  }
}
