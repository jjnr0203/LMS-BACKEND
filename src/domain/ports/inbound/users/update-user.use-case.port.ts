import { UserEntity } from '@domain/entities/users/user.entity';

export interface UpdateUserCommand {
  id: string; // Target user's cedula
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export abstract class UpdateUserUseCasePort {
  abstract execute(command: UpdateUserCommand): Promise<{ user: UserEntity }>;
}
