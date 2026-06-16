import {
  RegisterPaymentUseCasePort,
  RegisterPaymentCommand,
} from '../../ports/inbound/treasury/register-payment.use-case.port';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class RegisterPaymentUseCase implements RegisterPaymentUseCasePort {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(
    command: RegisterPaymentCommand,
  ): Promise<{ tuition: TuitionEntity }> {
    const tuition = await this.tuitionRepository.findByStudentId(
      command.studentId,
    );
    if (!tuition) {
      throw new NotFoundException(
        'Registro de matrícula no encontrado para este estudiante',
      );
    }

    if (tuition.paidInstallments >= 4) {
      throw new BadRequestException('Todas las cuotas ya han sido pagadas');
    }

    const newInstallments = tuition.paidInstallments + 1;
    const newStatus =
      newInstallments >= 4 ? ('pago_total' as const) : ('pendiente' as const);

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
