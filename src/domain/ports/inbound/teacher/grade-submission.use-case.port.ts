import { SubmissionEntity } from '../../../entities/academic/submission.entity';

export interface GradeSubmissionCommand {
  submissionId: string;
  grade: number;
  feedback?: string;
}

export abstract class GradeSubmissionUseCasePort {
  abstract execute(
    command: GradeSubmissionCommand,
  ): Promise<{ submission: SubmissionEntity }>;
}
