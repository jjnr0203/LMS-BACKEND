import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';

export class GetDashboardStatsUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(): Promise<Record<string, number>> {
    const counts = await this.userRepository.getCountsByRole();
    return {
      student: counts['student'] || 0,
      teacher: counts['teacher'] || 0,
      coordinator: counts['coordinator'] || 0,
      treasury: counts['treasury'] || 0,
      admin: counts['admin'] || 0,
    };
  }
}
