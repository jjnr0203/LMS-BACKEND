import { EnrollmentSubjectEntity } from '../../../entities/secretary/enrollment-subject.entity';

export abstract class EnrollmentSubjectRepositoryPort {
  abstract findByEnrollmentDetailId(enrollmentDetailId: string): Promise<EnrollmentSubjectEntity[]>;
  abstract save(enrollmentSubject: EnrollmentSubjectEntity): Promise<EnrollmentSubjectEntity>;
  abstract saveMany(enrollmentSubjects: EnrollmentSubjectEntity[]): Promise<EnrollmentSubjectEntity[]>;
}
