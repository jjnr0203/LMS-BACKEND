import { EnrollmentEntity } from '../../../entities/academic/enrollment.entity';

export abstract class EnrollStudentUseCasePort {
  abstract execute(
    studentId: string,
  ): Promise<{ enrollment: EnrollmentEntity }>;
}
