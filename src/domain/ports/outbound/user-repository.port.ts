import { User } from '../../entities/user.entity';

export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract save(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract softDelete(id: string): Promise<void>;
}
