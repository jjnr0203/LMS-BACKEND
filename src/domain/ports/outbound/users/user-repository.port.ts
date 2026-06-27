import { UserEntity } from '../../../entities/users/user.entity';

export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByIds(ids: string[]): Promise<UserEntity[]>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract save(user: UserEntity): Promise<UserEntity>;
  abstract findPaginated(
    page: number,
    limit: number,
    role?: string,
    search?: string,
  ): Promise<{ data: UserEntity[]; total: number }>;
  abstract softDelete(id: string): Promise<void>;
  abstract getCountsByRole(): Promise<Record<string, number>>;
}
