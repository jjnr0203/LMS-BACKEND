import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { LoginUseCase } from '../../domain/services/auth/login.use-case';
import { RegisterUserUseCase } from '../../domain/services/auth/register.use-case';
import { UserRepositoryPort } from '../../domain/ports/outbound/user-repository.port';
import { UserPostgresRepository } from '../../infrastructure/database/repositories/user-postgres.repository';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { JwtTokenGenerator } from '../../infrastructure/auth/services/jwt-token-generator';
import { TokenGeneratorPort } from '../../domain/ports/outbound/token-generator.port';
import { BcryptPasswordHasher } from '../../infrastructure/auth/services/bcrypt-password-hasher';
import { PasswordHasherPort } from '../../domain/ports/outbound/password-hasher.port';
import { LocalStrategy } from '../../infrastructure/auth/strategies/local.strategy';
import { JwtStrategy } from '../../infrastructure/auth/strategies/jwt.strategy';
import { GoogleOAuthStrategy } from '../../infrastructure/auth/strategies/google-oauth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const signOptions: JwtSignOptions = {
          expiresIn: (process.env.JWT_EXPIRES_IN ??
            '1h') as JwtSignOptions['expiresIn'],
        };
        return {
          secret: process.env.JWT_SECRET ?? 'default-secret',
          signOptions,
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUserUseCase,
    {
      provide: UserRepositoryPort,
      useClass: UserPostgresRepository,
    },
    {
      provide: TokenGeneratorPort,
      useClass: JwtTokenGenerator,
    },
    {
      provide: PasswordHasherPort,
      useClass: BcryptPasswordHasher,
    },
    LocalStrategy,
    JwtStrategy,
    GoogleOAuthStrategy,
  ],
  exports: [UserRepositoryPort, TokenGeneratorPort],
})
export class AuthModule {}
