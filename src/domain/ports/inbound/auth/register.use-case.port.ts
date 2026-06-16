import { UserEntity } from '@domain/entities/users/user.entity';

export interface RegisterCommand {
  id: string; // Cedula
  firstName: string;
  lastName: string;
  email: string;
  passwordRaw: string;
  roleName: string;
}

export abstract class RegisterUseCasePort {
  abstract execute(command: RegisterCommand): Promise<{ user: UserEntity }>;
}
