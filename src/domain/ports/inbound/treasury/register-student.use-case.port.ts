import { UserEntity } from '../../../entities/users/user.entity';
import { TuitionEntity } from '../../../entities/academic/tuition.entity';

export interface RegisterStudentCommand {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
  phone?: string;
  password: string;
}

export interface RegisterStudentResult {
  user: UserEntity;
  tuition: TuitionEntity;
}

export abstract class RegisterStudentUseCasePort {
  abstract execute(
    command: RegisterStudentCommand,
  ): Promise<RegisterStudentResult>;
}
