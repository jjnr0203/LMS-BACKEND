import { GetTreasuryDashboardUseCasePort } from '../../ports/inbound/treasury/get-treasury-dashboard.use-case.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';

export class GetTreasuryDashboardUseCase implements GetTreasuryDashboardUseCasePort {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(): Promise<{ stats: any; recentTuitions: TuitionEntity[] }> {
    const { data } = await this.tuitionRepository.findAllWithStudent();

    const stats = {
      total: data.length,
      pagoTotal: data.filter((t) => t.status === 'pago_total').length,
      pendiente: data.filter(
        (t) => t.status === 'pendiente' || t.status === 'convenio',
      ).length,
      noPaga: data.filter((t) => t.status === 'no_paga').length,
      cuotasPagadas: data.reduce((sum, t) => sum + t.paidInstallments, 0),
    };

    const recentTuitions = data.slice(0, 5);

    return { stats, recentTuitions };
  }
}
