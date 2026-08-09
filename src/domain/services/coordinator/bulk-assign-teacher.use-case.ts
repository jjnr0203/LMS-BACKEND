import { SubjectRepositoryPort } from '../../ports/outbound/academic/subject-repository.port';
import { TeacherSubjectRepositoryPort } from '../../ports/outbound/academic/teacher-subject-repository.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { TeacherSubjectEntity } from '../../entities/academic/teacher-subject.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export class BulkAssignTeacherUseCase {
  constructor(
    private readonly subjectRepository: SubjectRepositoryPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly teacherSubjectRepository: TeacherSubjectRepositoryPort,
  ) {}

  async execute(command: {
    curriculumId?: string;
    academicTermId: string;
    subjects: {
      subjectId: string;
      assignments: {
        teacherId: string;
        modalityIds: string[];
        jornadaIds: string[];
      }[];
    }[];
  }): Promise<void> {
    if (!command.subjects || command.subjects.length === 0) {
      throw new BadRequestException('No se han enviado materias para asignar.');
    }

    // Verify all subjects exist
    const subjectIds = command.subjects.map((s) => s.subjectId);
    const subjects = await this.subjectRepository.findByIds(subjectIds);
    if (subjects.length !== subjectIds.length) {
      throw new NotFoundException('Algunas materias no fueron encontradas.');
    }

    // Verify all teachers exist
    const teacherIds = new Set<string>();
    for (const sub of command.subjects) {
      for (const assign of sub.assignments) {
        teacherIds.add(assign.teacherId);
      }
    }
    const teachers = await this.userRepository.findByIds([...teacherIds]);
    if (teachers.length !== teacherIds.size) {
      throw new NotFoundException('Algunos docentes no fueron encontrados.');
    }

    const allNewRelations: TeacherSubjectEntity[] = [];

    for (const subjectData of command.subjects) {
      // 1. Delete all assignments for this subject in this term and curriculum
      await this.teacherSubjectRepository.deleteBySubjectAndTerm(
        subjectData.subjectId,
        command.academicTermId,
        command.curriculumId,
      );

      // 2. Prepare new cartesian product of assignments
      for (const assignment of subjectData.assignments) {
        for (const modalityId of assignment.modalityIds) {
          for (const jornadaId of assignment.jornadaIds) {
            const relation = new TeacherSubjectEntity(
              crypto.randomUUID(),
              assignment.teacherId,
              subjectData.subjectId,
              new Date(),
              command.curriculumId,
              command.academicTermId,
              modalityId,
              jornadaId,
            );

            allNewRelations.push(relation);
          }
        }
      }
    }

    // 3. Save all new assignments in bulk
    await this.teacherSubjectRepository.saveMany(allNewRelations);
  }
}
