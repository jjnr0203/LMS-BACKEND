import { ManageSemesterColorsUseCasePort } from '../../ports/inbound/admin/manage-semester-colors.use-case.port';
import { SemesterColorRepositoryPort } from '../../ports/outbound/academic/semester-color-repository.port';

export class ManageSemesterColorsUseCase implements ManageSemesterColorsUseCasePort {
  constructor(
    private readonly semesterColorRepository: SemesterColorRepositoryPort,
  ) {}

  async getColors(): Promise<{ semester: number; color: string }[]> {
    return this.semesterColorRepository.findAll();
  }

  async saveColor(semester: number, color: string): Promise<void> {
    await this.semesterColorRepository.save(semester, color);
  }
}
