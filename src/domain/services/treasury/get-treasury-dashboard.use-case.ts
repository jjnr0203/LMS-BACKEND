import { GetTreasuryDashboardUseCasePort } from '../../ports/inbound/treasury/get-treasury-dashboard.use-case.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { StudentRepositoryPort } from '../../ports/outbound/users/student-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';

export class GetTreasuryDashboardUseCase implements GetTreasuryDashboardUseCasePort {
  constructor(
    private readonly tuitionRepository: TuitionRepositoryPort,
    private readonly studentRepository: StudentRepositoryPort,
  ) {}

  async execute(): Promise<{ stats: any; recentTuitions: TuitionEntity[] }> {
    const [{ data: students }, { data: tuitions }] = await Promise.all([
      this.studentRepository.findPaginated(1, 100000),
      this.tuitionRepository.findAllWithStudent(100000, 0),
    ]);

    const studentIds = new Set(students.map((s) => s.id));
    const validTuitions = tuitions.filter((t) => studentIds.has(t.studentId));

    const matriculados = validTuitions.filter(
      (t) => t.status === 'convenio' || t.status === 'pago_total',
    );
    const pendientes = validTuitions.filter(
      (t) => t.status === 'no_paga' || t.status === 'pendiente',
    );

    const stats = {
      total: students.length,
      matriculados: matriculados.length,
      pendientes: pendientes.length,
      pagoTotal: matriculados.filter((t) => t.status === 'pago_total').length,
      cuotasPagadas: validTuitions.reduce(
        (sum, t) => sum + t.paidInstallments,
        0,
      ),
    };

    const recentTuitions = validTuitions.slice(0, 5);

    return { stats, recentTuitions };
  }
}
