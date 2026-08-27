import { randomUUID } from 'node:crypto';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity, TuitionStatus } from '../../entities/academic/tuition.entity';

export class MatricularUseCase {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(studentId: string): Promise<{ tuition: TuitionEntity }> {
    const existing = await this.tuitionRepository.findByStudentId(studentId);

    let status: TuitionStatus;
    let paid: number;

    if (!existing) {
      status = 'no_paga';
      paid = 0;
    } else if (existing.status === 'no_paga') {
      status = 'convenio';
      paid = existing.paidInstallments;
    } else {
      status = existing.status;
      paid = existing.paidInstallments;
    }

    const tuition = new TuitionEntity(
      existing?.id ?? randomUUID(),
      studentId,
      status,
      paid,
    );

    const saved = await this.tuitionRepository.save(tuition);
    return { tuition: saved };
  }
}
