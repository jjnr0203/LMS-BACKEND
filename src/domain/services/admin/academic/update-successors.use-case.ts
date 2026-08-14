import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { NotFoundException } from '@nestjs/common';

export class UpdateSuccessorsUseCase {
  constructor(
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
  ) {}

  async execute(
    careerSubjectId: string,
    successorIds: string[],
  ): Promise<void> {
    const parentRelation = await this.careerSubjectRepository.findById(careerSubjectId);
    if (!parentRelation) {
      throw new NotFoundException('CareerSubject not found');
    }
    if (!parentRelation.curriculumId) {
      throw new NotFoundException('CareerSubject curriculum not found');
    }

    // Find all subjects in the same curriculum
    const allSubjectsInCurriculum = await this.careerSubjectRepository.findByCurriculum(parentRelation.curriculumId);

    // 1. Remove parent from current successors
    const currentSuccessors = allSubjectsInCurriculum.filter(s => s.prerequisiteIds && s.prerequisiteIds.includes(careerSubjectId));
    for (const suc of currentSuccessors) {
      if (!successorIds.includes(suc.id)) {
        suc.prerequisiteIds = suc.prerequisiteIds.filter(id => id !== careerSubjectId);
        await this.careerSubjectRepository.save(suc);
      }
    }

    // 2. Add parent to new successors
    for (const newSucId of successorIds) {
      const suc = allSubjectsInCurriculum.find(s => s.id === newSucId);
      if (suc) {
        if (!suc.prerequisiteIds) {
          suc.prerequisiteIds = [];
        }
        if (!suc.prerequisiteIds.includes(careerSubjectId)) {
          suc.prerequisiteIds.push(careerSubjectId);
          await this.careerSubjectRepository.save(suc);
        }
      }
    }
  }
}
