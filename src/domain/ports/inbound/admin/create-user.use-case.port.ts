import { UserEntity } from '../../../entities/users/user.entity';

export interface CreateUserCommand {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleName: string;
}

export abstract class CreateUserUseCasePort {
  abstract execute(command: CreateUserCommand): Promise<{ user: UserEntity }>;
}
