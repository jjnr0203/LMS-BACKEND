import { UserEntity } from '../../../entities/users/user.entity';

export interface RegisterTeacherCommand {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: Date;
  phone?: string;
  password: string;
  facultyIds?: string[];
}

export abstract class RegisterTeacherUseCasePort {
  abstract execute(
    command: RegisterTeacherCommand,
  ): Promise<{ user: UserEntity }>;
}
