import { AcademicTerm } from '../../../entities/academic/academic-term.entity';

export const ACADEMIC_TERM_REPOSITORY = Symbol('ACADEMIC_TERM_REPOSITORY');

export interface AcademicTermRepositoryPort {
  save(term: AcademicTerm): Promise<AcademicTerm>;
  findById(id: string): Promise<AcademicTerm | null>;
  findAll(): Promise<AcademicTerm[]>;
  delete(id: string): Promise<void>;
  deactivateAllExcept(id: string): Promise<void>;
}
