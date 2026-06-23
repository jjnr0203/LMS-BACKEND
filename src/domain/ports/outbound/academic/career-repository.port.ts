import { Career } from '../../../entities/academic/career.entity';

export const CAREER_REPOSITORY = Symbol('CAREER_REPOSITORY');

export interface CareerRepositoryPort {
  save(career: Career): Promise<Career>;
  findById(id: string): Promise<Career | null>;
  findAll(): Promise<Career[]>;
  delete(id: string): Promise<void>;
}
