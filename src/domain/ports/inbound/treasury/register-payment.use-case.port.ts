import { TuitionEntity } from '../../../entities/academic/tuition.entity';

export interface RegisterPaymentCommand {
  studentId: string;
}

export abstract class RegisterPaymentUseCasePort {
  abstract execute(
    command: RegisterPaymentCommand,
  ): Promise<{ tuition: TuitionEntity }>;
}
