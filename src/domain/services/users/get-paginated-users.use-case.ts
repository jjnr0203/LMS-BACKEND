import { GetPaginatedUsersUseCasePort, GetPaginatedUsersCommand } from '../../ports/inbound/users/get-paginated-users.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { PaginatedResponse } from '../../../common/pagination/pagination.response';
import { UserEntity } from '../../entities/users/user.entity';

export class GetPaginatedUsersUseCase implements GetPaginatedUsersUseCasePort {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async execute(command: GetPaginatedUsersCommand, host: string): Promise<PaginatedResponse<UserEntity>> {
    const { page, limit } = command;
    const { data, total } = await this.userRepository.findPaginated(page, limit);
    
    const lastPage = Math.ceil(total / limit) || 1;
    
    // As per user's request, we use localhost base if no domain is provided. The controller will pass the host.
    const baseUrl = `http://${host}/api/users`;
    
    const next = page < lastPage ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null;
    const prev = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null;

    return {
      data,
      pagination: {
        current_page: page,
        last_page: lastPage,
        per_page: limit,
        total,
        next,
        prev
      }
    };
  }
}
