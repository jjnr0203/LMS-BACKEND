import { SubjectEntity } from '../../../entities/academic/subject.entity';

export abstract class SubjectRepositoryPort {
  abstract findById(id: string): Promise<SubjectEntity | null>;
  abstract findByCode(code: string): Promise<SubjectEntity | null>;
  abstract save(subject: SubjectEntity): Promise<SubjectEntity>;
  abstract findAll(): Promise<SubjectEntity[]>;
  abstract findByTeacherId(teacherId: string): Promise<SubjectEntity[]>;
  abstract delete(id: string): Promise<void>;
}
