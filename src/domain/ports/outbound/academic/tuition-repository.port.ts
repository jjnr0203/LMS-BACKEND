import { TuitionEntity } from '../../../entities/academic/tuition.entity';

export abstract class TuitionRepositoryPort {
  abstract findById(id: string): Promise<TuitionEntity | null>;
  abstract findByStudentId(studentId: string): Promise<TuitionEntity | null>;
  abstract save(tuition: TuitionEntity): Promise<TuitionEntity>;
  abstract findAllWithStudent(
    limit?: number,
    offset?: number,
  ): Promise<{ data: TuitionEntity[]; total: number }>;
  abstract findByStatus(status: string): Promise<TuitionEntity[]>;
}
