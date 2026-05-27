import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUseCase } from '../../../domain/services/auth/login.use-case';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<unknown> {
    try {
      const result = await this.loginUseCase.execute({ email, password });
      return result.user;
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
