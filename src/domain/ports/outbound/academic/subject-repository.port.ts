import { SubjectEntity } from '../../../entities/academic/subject.entity';

export abstract class SubjectRepositoryPort {
  abstract findById(id: string): Promise<SubjectEntity | null>;
  abstract findByIds(ids: string[]): Promise<SubjectEntity[]>;
  abstract findByCode(code: string): Promise<SubjectEntity | null>;
  abstract findByCodes(codes: string[]): Promise<SubjectEntity[]>;
  abstract save(subject: SubjectEntity): Promise<SubjectEntity>;
  abstract findAll(): Promise<SubjectEntity[]>;
  abstract count(): Promise<number>;
  abstract findByTeacherId(teacherId: string): Promise<SubjectEntity[]>;
  abstract delete(id: string): Promise<void>;
}
