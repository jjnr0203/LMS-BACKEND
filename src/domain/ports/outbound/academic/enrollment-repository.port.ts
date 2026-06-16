import { EnrollmentEntity } from '../../../entities/academic/enrollment.entity';

export abstract class EnrollmentRepositoryPort {
  abstract findById(id: string): Promise<EnrollmentEntity | null>;
  abstract findByStudentId(studentId: string): Promise<EnrollmentEntity | null>;
  abstract save(enrollment: EnrollmentEntity): Promise<EnrollmentEntity>;
  abstract findAll(): Promise<EnrollmentEntity[]>;
}
