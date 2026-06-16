import {
  EnrollStudentSubjectUseCasePort,
  EnrollStudentSubjectCommand,
} from '../../ports/inbound/teacher/enroll-student-subject.use-case.port';
import { StudentSubjectRepositoryPort } from '../../ports/outbound/academic/student-subject-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { StudentSubjectEntity } from '../../entities/academic/student-subject.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export class EnrollStudentSubjectUseCase implements EnrollStudentSubjectUseCasePort {
  constructor(
    private readonly studentSubjectRepository: StudentSubjectRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly subjectRepository: SubjectRepositoryPort,
  ) {}

  async execute(
    command: EnrollStudentSubjectCommand,
  ): Promise<{ relation: StudentSubjectEntity }> {
    const student = await this.userRepository.findById(command.studentId);
    if (!student) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const subject = await this.subjectRepository.findById(command.subjectId);
    if (!subject) {
      throw new NotFoundException('Materia no encontrada');
    }

    const teacher = await this.userRepository.findById(command.teacherId);
    if (!teacher) {
      throw new NotFoundException('Docente no encontrado');
    }

    const existingRelation =
      await this.studentSubjectRepository.findByStudentAndSubject(
        command.studentId,
        command.subjectId,
      );
    if (existingRelation) {
      throw new BadRequestException(
        'El estudiante ya está inscrito en esta materia',
      );
    }

    const relation = new StudentSubjectEntity(
      crypto.randomUUID(),
      command.studentId,
      command.subjectId,
      command.teacherId,
      new Date(),
    );

    const savedRelation = await this.studentSubjectRepository.save(relation);
    return { relation: savedRelation };
  }
}
