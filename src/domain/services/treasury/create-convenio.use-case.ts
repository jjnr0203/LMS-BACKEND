import { randomUUID } from 'node:crypto';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';
import { BadRequestException } from '@nestjs/common';

export class CreateConvenioUseCase {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(studentId: string): Promise<{ tuition: TuitionEntity }> {
    const existing = await this.tuitionRepository.findByStudentId(studentId);

    if (existing && existing.status === 'pago_total') {
      throw new BadRequestException(
        'No se puede crear un convenio en una matrícula pagada en su totalidad',
      );
    }

    if (existing && existing.status === 'convenio') {
      throw new BadRequestException('El estudiante ya tiene un convenio activo');
    }

    const tuition = existing
      ? new TuitionEntity(
          existing.id,
          existing.studentId,
          'convenio',
          existing.paidInstallments,
        )
      : new TuitionEntity(randomUUID(), studentId, 'convenio', 0);

    const saved = await this.tuitionRepository.save(tuition);
    return { tuition: saved };
  }
}
