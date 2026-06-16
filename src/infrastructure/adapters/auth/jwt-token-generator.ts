import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  TokenGeneratorPort,
  TokenPayload,
} from '@domain/ports/outbound/auth/token-generator.port';

@Injectable()
export class JwtTokenGenerator implements TokenGeneratorPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_EXPIRES_IN',
          '15m',
        ) as import('jsonwebtoken').SignOptions['expiresIn'],
      },
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as import('jsonwebtoken').SignOptions['expiresIn'],
      },
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
