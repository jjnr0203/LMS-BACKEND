import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  TokenGeneratorPort,
  TokenPayload,
} from '../../../domain/ports/outbound/token-generator.port';

@Injectable()
export class JwtTokenGenerator extends TokenGeneratorPort {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  generate(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const options: JwtSignOptions = {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
        '7d') as JwtSignOptions['expiresIn'],
    };
    return this.jwtService.sign(payload, options);
  }

  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }
}
