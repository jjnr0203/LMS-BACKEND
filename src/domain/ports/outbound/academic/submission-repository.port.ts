import { SubmissionEntity } from '../../../entities/academic/submission.entity';

export abstract class SubmissionRepositoryPort {
  abstract findById(id: string): Promise<SubmissionEntity | null>;
  abstract save(submission: SubmissionEntity): Promise<SubmissionEntity>;
  abstract findByAssignmentId(
    assignmentId: string,
  ): Promise<SubmissionEntity[]>;
  abstract findByStudentId(studentId: string): Promise<SubmissionEntity[]>;
  abstract findByAssignmentAndStudent(
    assignmentId: string,
    studentId: string,
  ): Promise<SubmissionEntity | null>;
}
