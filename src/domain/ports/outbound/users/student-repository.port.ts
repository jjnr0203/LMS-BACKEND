import { StudentEntity } from '../../../entities/users/student.entity';

export abstract class StudentRepositoryPort {
  abstract findById(id: string): Promise<StudentEntity | null>;
  abstract findByIds(ids: string[]): Promise<StudentEntity[]>;
  abstract findByEmail(email: string): Promise<StudentEntity | null>;
  abstract save(student: StudentEntity): Promise<StudentEntity>;
  abstract findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: StudentEntity[]; total: number }>;
  abstract softDelete(id: string): Promise<void>;
  abstract count(): Promise<number>;
}
