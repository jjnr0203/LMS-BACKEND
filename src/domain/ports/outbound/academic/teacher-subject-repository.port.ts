import { TeacherSubjectEntity } from '../../../entities/academic/teacher-subject.entity';

export abstract class TeacherSubjectRepositoryPort {
  abstract save(relation: TeacherSubjectEntity): Promise<TeacherSubjectEntity>;
  abstract findByTeacherAndSubject(
    teacherId: string,
    subjectId: string,
  ): Promise<TeacherSubjectEntity | null>;
  abstract findBySubjectId(subjectId: string): Promise<TeacherSubjectEntity[]>;
}
