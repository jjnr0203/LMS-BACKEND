import { UserEntity } from '../../../entities/users/user.entity';
import { PaginatedResponse } from '../../../../common/pagination/pagination.response';

export interface GetPaginatedUsersCommand {
  page: number;
  limit: number;
  role?: string;
}

export abstract class GetPaginatedUsersUseCasePort {
  abstract execute(command: GetPaginatedUsersCommand, host: string): Promise<PaginatedResponse<UserEntity>>;
}
