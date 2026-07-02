import { Curriculum } from '../../../entities/academic/curriculum.entity';

export const CURRICULUM_REPOSITORY = Symbol('CURRICULUM_REPOSITORY');

export interface CurriculumRepositoryPort {
  save(curriculum: Curriculum): Promise<Curriculum>;
  findById(id: string): Promise<Curriculum | null>;
  findByCareer(careerId: string): Promise<Curriculum[]>;
  findByCareerIds(careerIds: string[]): Promise<Curriculum[]>;
  delete(id: string): Promise<void>;
}
