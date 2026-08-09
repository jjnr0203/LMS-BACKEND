import { EnrollmentDetailEntity } from '../../../entities/secretary/enrollment-detail.entity';

export interface CreateEnrollmentCommand {
  studentId: string;
  academicTermId: string;
  careerId: string;
  level: number;
  subjectIds?: string[];
}

export abstract class CreateEnrollmentUseCasePort {
  abstract execute(
    command: CreateEnrollmentCommand,
  ): Promise<{ enrollment: EnrollmentDetailEntity }>;
}
