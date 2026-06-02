import { RefreshUseCasePort } from '../../ports/inbound/auth/refresh.use-case.port';
import { RefreshTokenRepositoryPort } from '../../ports/outbound/auth/refresh-token-repository.port';
import { TokenGeneratorPort } from '../../ports/outbound/auth/token-generator.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../ports/outbound/users/role-repository.port';
import { RefreshTokenEntity } from '../../entities/auth/refresh-token.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

export class RefreshUseCase implements RefreshUseCasePort {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(tokenString: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Find token in DB
    const tokenEntity = await this.refreshTokenRepository.findByToken(tokenString);
    
    if (!tokenEntity || tokenEntity.isRevoked || tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de refresco inválido o expirado');
    }

    // 2. Revoke the old token for security (Refresh Token Rotation)
    await this.refreshTokenRepository.revoke(tokenEntity.id);

    // 3. Get user and role
    const user = await this.userRepository.findById(tokenEntity.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }

    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new UnauthorizedException('Rol no encontrado');
    }

    // 4. Generate new tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: role.name,
    };

    const newAccessToken = this.tokenGenerator.generateAccessToken(payload);
    const newRefreshTokenString = this.tokenGenerator.generateRefreshToken(payload);

    const newRefreshTokenEntity = new RefreshTokenEntity(
      crypto.randomUUID(),
      newRefreshTokenString,
      user.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    await this.refreshTokenRepository.save(newRefreshTokenEntity);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenString,
    };
  }
}
