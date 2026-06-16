import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  TokenGeneratorPort,
  TokenPayload,
} from '../../../domain/ports/outbound/auth/token-generator.port';
import type { SignOptions } from 'jsonwebtoken';

@Injectable()
export class JwtTokenGenerator implements TokenGeneratorPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    const expiresIn = this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '15m',
    ) as unknown as SignOptions['expiresIn'];
    return this.jwtService.sign(
      { ...payload, type: 'access' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
      },
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    ) as unknown as SignOptions['expiresIn'];
    return this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn,
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
