import { StudentSubjectEntity } from '../../../entities/academic/student-subject.entity';

export abstract class StudentSubjectRepositoryPort {
  abstract findById(id: string): Promise<StudentSubjectEntity | null>;
  abstract save(relation: StudentSubjectEntity): Promise<StudentSubjectEntity>;
  abstract findByStudentId(studentId: string): Promise<StudentSubjectEntity[]>;
  abstract findBySubjectId(subjectId: string): Promise<StudentSubjectEntity[]>;
  abstract findByStudentAndSubject(
    studentId: string,
    subjectId: string,
  ): Promise<StudentSubjectEntity | null>;
  abstract findByTeacherId(teacherId: string): Promise<StudentSubjectEntity[]>;
}
