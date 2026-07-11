import { CoordinatorSubjectColorRepositoryPort } from '../../ports/outbound/academic/coordinator-subject-color-repository.port';

export class ManageCoordinatorSubjectColorsUseCase {
  constructor(
    private readonly repository: CoordinatorSubjectColorRepositoryPort,
  ) {}

  async getColors(coordinatorId: string) {
    return this.repository.findByCoordinatorId(coordinatorId);
  }

  async saveColor(coordinatorId: string, subjectId: string, color: string) {
    await this.repository.save(coordinatorId, subjectId, color);
  }
}
