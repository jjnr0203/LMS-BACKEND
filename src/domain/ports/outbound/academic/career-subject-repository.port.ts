import { CareerSubject } from '../../../entities/academic/career-subject.entity';

export const CAREER_SUBJECT_REPOSITORY = Symbol('CAREER_SUBJECT_REPOSITORY');

export interface CareerSubjectRepositoryPort {
  save(careerSubject: CareerSubject): Promise<CareerSubject>;
  deleteByCareerAndSubject(careerId: string, subjectId: string): Promise<void>;
  findByCareer(careerId: string): Promise<CareerSubject[]>;
}
