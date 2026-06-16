import { LogoutUseCasePort } from '../../ports/inbound/auth/logout.use-case.port';
import { RefreshTokenRepositoryPort } from '../../ports/outbound/auth/refresh-token-repository.port';

export class LogoutUseCase implements LogoutUseCasePort {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(tokenString: string): Promise<void> {
    const tokenEntity =
      await this.refreshTokenRepository.findByToken(tokenString);
    if (tokenEntity) {
      await this.refreshTokenRepository.revokeAllForUser(tokenEntity.userId);
    }
  }
}
