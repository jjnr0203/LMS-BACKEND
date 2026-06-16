import { RefreshTokenEntity } from '@domain/entities/auth/refresh-token.entity';

export abstract class RefreshTokenRepositoryPort {
  abstract save(token: RefreshTokenEntity): Promise<RefreshTokenEntity>;
  abstract findByToken(token: string): Promise<RefreshTokenEntity | null>;
  abstract revoke(token: string): Promise<void>;
  abstract revokeAllForUser(userId: string): Promise<void>;
  abstract hasActiveSession(userId: string): Promise<boolean>;
}
