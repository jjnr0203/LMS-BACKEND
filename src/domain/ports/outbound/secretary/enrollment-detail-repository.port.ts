import { EnrollmentDetailEntity } from '../../../entities/secretary/enrollment-detail.entity';

export abstract class EnrollmentDetailRepositoryPort {
  abstract findById(id: string): Promise<EnrollmentDetailEntity | null>;
  abstract findByStudentAndTerm(
    studentId: string,
    academicTermId: string,
  ): Promise<EnrollmentDetailEntity | null>;
  abstract save(
    enrollment: EnrollmentDetailEntity,
  ): Promise<EnrollmentDetailEntity>;
  abstract findByStudentId(
    studentId: string,
  ): Promise<EnrollmentDetailEntity[]>;
}
