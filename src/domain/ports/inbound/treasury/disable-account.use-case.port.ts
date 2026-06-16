import { UserEntity } from '../../../entities/users/user.entity';
import { TuitionEntity } from '../../../entities/academic/tuition.entity';

export interface DisableAccountCommand {
  studentId: string;
}

export interface DisableAccountResult {
  user: UserEntity;
  tuition: TuitionEntity;
}

export abstract class DisableAccountUseCasePort {
  abstract execute(
    command: DisableAccountCommand,
  ): Promise<DisableAccountResult>;
}
