import { CareerSubject } from '../../../entities/academic/career-subject.entity';

export const CAREER_SUBJECT_REPOSITORY = Symbol('CAREER_SUBJECT_REPOSITORY');

export interface CareerSubjectRepositoryPort {
  findById(id: string): Promise<CareerSubject | null>;
  save(careerSubject: CareerSubject): Promise<CareerSubject>;
  deleteByCareerAndSubject(careerId: string, subjectId: string): Promise<void>;
  findByCareer(careerId: string): Promise<CareerSubject[]>;
  findByCareerIds(careerIds: string[]): Promise<CareerSubject[]>;
  findBySubject(subjectId: string): Promise<CareerSubject[]>;
  findBySubjectIds(subjectIds: string[]): Promise<CareerSubject[]>;
  findByCareerAndSubject(
    careerId: string,
    subjectId: string,
  ): Promise<CareerSubject | null>;
  deleteBySubject(subjectId: string): Promise<void>;
  findByCurriculum(curriculumId: string): Promise<CareerSubject[]>;
  findSubjectsByCareerAndSemester(
    careerId: string,
    semester: number,
  ): Promise<any[]>;
  findSemestersByCareer(careerId: string): Promise<number[]>;
}
