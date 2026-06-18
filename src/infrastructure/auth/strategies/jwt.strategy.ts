import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepositoryPort } from '@domain/ports/outbound/auth/refresh-token-repository.port';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly refreshTokenRepo: RefreshTokenRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Token inválido para esta operación');
    }

    const hasSession = await this.refreshTokenRepo.hasActiveSession(
      payload.sub,
    );
    if (!hasSession) {
      throw new UnauthorizedException('Sesión cerrada o expirada');
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
