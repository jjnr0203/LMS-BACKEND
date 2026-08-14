import { randomUUID } from 'node:crypto';
import {
  RegisterPaymentUseCasePort,
  RegisterPaymentCommand,
} from '../../ports/inbound/treasury/register-payment.use-case.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';
import { BadRequestException } from '@nestjs/common';

export class RegisterPaymentUseCase implements RegisterPaymentUseCasePort {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(
    command: RegisterPaymentCommand,
  ): Promise<{ tuition: TuitionEntity }> {
    const existing = await this.tuitionRepository.findByStudentId(
      command.studentId,
    );

    const tuition =
      existing ??
      new TuitionEntity(randomUUID(), command.studentId, 'no_paga', 0);

    if (tuition.status === 'pago_total') {
      throw new BadRequestException(
        'La matrícula está pagada en su totalidad, no se pueden registrar más abonos',
      );
    }

    const newInstallments = tuition.paidInstallments + 1;
    const newStatus =
      newInstallments >= 4
        ? ('pago_total' as const)
        : tuition.status === 'no_paga'
          ? ('convenio' as const)
          : tuition.status;

    const updatedTuition = new TuitionEntity(
      tuition.id,
      tuition.studentId,
      newStatus,
      newInstallments,
    );

    const savedTuition = await this.tuitionRepository.save(updatedTuition);
    return { tuition: savedTuition };
  }
}
