import { StudentSubjectEntity } from '../../../entities/academic/student-subject.entity';

export interface EnrollStudentSubjectCommand {
  studentId: string;
  subjectId: string;
  teacherId: string;
}

export abstract class EnrollStudentSubjectUseCasePort {
  abstract execute(
    command: EnrollStudentSubjectCommand,
  ): Promise<{ relation: StudentSubjectEntity }>;
}
