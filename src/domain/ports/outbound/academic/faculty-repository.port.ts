import { Faculty } from '../../../entities/academic/faculty.entity';

export const FACULTY_REPOSITORY = Symbol('FACULTY_REPOSITORY');

export interface FacultyRepositoryPort {
  save(faculty: Faculty): Promise<Faculty>;
  findById(id: string): Promise<Faculty | null>;
  findAll(): Promise<Faculty[]>;
  delete(id: string): Promise<void>;
}
