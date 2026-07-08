import { TeacherSubjectEntity } from '../../../entities/academic/teacher-subject.entity';

export abstract class TeacherSubjectRepositoryPort {
  abstract save(relation: TeacherSubjectEntity): Promise<TeacherSubjectEntity>;
  abstract findByTeacherAndSubject(
    teacherId: string,
    subjectId: string,
  ): Promise<TeacherSubjectEntity | null>;
  abstract findBySubjectId(
    subjectId: string,
    curriculumId?: string,
  ): Promise<TeacherSubjectEntity[]>;
  abstract findBySubjectIds(
    subjectIds: string[],
  ): Promise<TeacherSubjectEntity[]>;
  abstract deleteBySubjectId(
    subjectId: string,
    curriculumId?: string,
  ): Promise<void>;
  abstract deleteByContext(
    subjectId: string,
    academicTermId: string,
    modalityId: string,
    jornadaId: string,
    curriculumId?: string,
  ): Promise<void>;
  abstract deleteBySubjectAndTerm(
    subjectId: string,
    academicTermId: string,
    curriculumId?: string,
  ): Promise<void>;
  abstract deleteById(id: string): Promise<void>;
  abstract saveMany(relations: TeacherSubjectEntity[]): Promise<void>;
}
