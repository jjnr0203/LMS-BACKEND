import { randomUUID } from 'node:crypto';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';
import { BadRequestException } from '@nestjs/common';

export class CompleteTuitionUseCase {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(studentId: string): Promise<{ tuition: TuitionEntity }> {
    const existing = await this.tuitionRepository.findByStudentId(studentId);

    if (existing && existing.status === 'pago_total') {
      throw new BadRequestException(
        'La matrícula ya está marcada como pago completo',
      );
    }

    const tuition = existing
      ? new TuitionEntity(existing.id, existing.studentId, 'pago_total', 4)
      : new TuitionEntity(randomUUID(), studentId, 'pago_total', 4);

    const saved = await this.tuitionRepository.save(tuition);
    return { tuition: saved };
  }
}
