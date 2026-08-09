import { TeacherEntity } from '../../../entities/users/teacher.entity';

export abstract class TeacherRepositoryPort {
  abstract findById(id: string): Promise<TeacherEntity | null>;
  abstract findByIds(ids: string[]): Promise<TeacherEntity[]>;
  abstract save(teacher: TeacherEntity): Promise<TeacherEntity>;
  abstract findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: TeacherEntity[]; total: number }>;
  abstract softDelete(id: string): Promise<void>;
  abstract count(): Promise<number>;
}
