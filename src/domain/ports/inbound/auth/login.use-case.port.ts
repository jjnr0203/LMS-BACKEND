import { UserEntity } from '../../../entities/users/user.entity';

export interface LoginCommand {
  id: string;
  passwordRaw: string;
}

export interface LoginResult {
  user: UserEntity;
  accessToken: string;
  refreshToken: string;
}

export abstract class LoginUseCasePort {
  abstract execute(command: LoginCommand): Promise<LoginResult>;
}
