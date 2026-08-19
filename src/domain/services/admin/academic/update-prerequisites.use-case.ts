import { CareerSubjectRepositoryPort } from '../../../ports/outbound/academic/career-subject-repository.port';
import { NotFoundException } from '@nestjs/common';

export class UpdatePrerequisitesUseCase {
  constructor(
    private readonly careerSubjectRepository: CareerSubjectRepositoryPort,
  ) {}

  async execute(
    careerSubjectId: string,
    prerequisiteIds: string[],
  ): Promise<void> {
    const relation = await this.careerSubjectRepository.findById(careerSubjectId);
    if (!relation) {
      throw new NotFoundException('CareerSubject not found');
    }

    relation.prerequisiteIds = prerequisiteIds;
    await this.careerSubjectRepository.save(relation);
  }
}
