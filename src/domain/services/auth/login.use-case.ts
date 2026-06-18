import {
  LoginUseCasePort,
  LoginCommand,
  LoginResult,
} from '../../ports/inbound/auth/login.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/auth/password-hasher.port';
import { TokenGeneratorPort } from '../../ports/outbound/auth/token-generator.port';
import { RefreshTokenRepositoryPort } from '../../ports/outbound/auth/refresh-token-repository.port';
import { RoleRepositoryPort } from '../../ports/outbound/users/role-repository.port';
import { RefreshTokenEntity } from '../../entities/auth/refresh-token.entity';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as crypto from 'crypto';

export class LoginUseCase implements LoginUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenGenerator: TokenGeneratorPort,
    private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.userRepository.findById(command.id);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Su cuenta ha sido suspendida por falta de pago. Contacte a tesorería.',
      );
    }

    const isPasswordValid = await this.passwordHasher.compare(
      command.passwordRaw,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const role = await this.roleRepository.findById(user.roleId);
    if (!role) {
      throw new Error('Role not found for user');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: role.name,
    };

    const accessToken = this.tokenGenerator.generateAccessToken(payload);
    const refreshTokenString =
      this.tokenGenerator.generateRefreshToken(payload);

    const refreshTokenEntity = new RefreshTokenEntity(
      crypto.randomUUID(), // id
      refreshTokenString,
      user.id,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiration for DB tracking
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      user,
      accessToken,
      refreshToken: refreshTokenString,
    };
  }
}
