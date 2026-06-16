import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth/auth.controller';
import { LoginUseCase } from '../../domain/services/auth/login.use-case';
import { RegisterUseCase } from '../../domain/services/auth/register.use-case';
import { RefreshUseCase } from '../../domain/services/auth/refresh.use-case';
import { LogoutUseCase } from '../../domain/services/auth/logout.use-case';
import { UserRepositoryPort } from '../../domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../domain/ports/outbound/users/role-repository.port';
import { RefreshTokenRepositoryPort } from '../../domain/ports/outbound/auth/refresh-token-repository.port';
import { PasswordHasherPort } from '../../domain/ports/outbound/auth/password-hasher.port';
import { TokenGeneratorPort } from '../../domain/ports/outbound/auth/token-generator.port';
import { RepositoryProvidersModule } from './repository-providers.module';
import { JwtStrategy } from '../../infrastructure/auth/strategies/jwt.strategy';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [AuthController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
        tokenGen: TokenGeneratorPort,
        refreshRepo: RefreshTokenRepositoryPort,
      ) => new LoginUseCase(userRepo, roleRepo, hasher, tokenGen, refreshRepo),
      inject: [
        UserRepositoryPort,
        RoleRepositoryPort,
        PasswordHasherPort,
        TokenGeneratorPort,
        RefreshTokenRepositoryPort,
      ],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
      ) => new RegisterUseCase(userRepo, roleRepo, hasher),
      inject: [UserRepositoryPort, RoleRepositoryPort, PasswordHasherPort],
    },
    {
      provide: RefreshUseCase,
      useFactory: (
        refreshRepo: RefreshTokenRepositoryPort,
        tokenGen: TokenGeneratorPort,
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
      ) => new RefreshUseCase(refreshRepo, tokenGen, userRepo, roleRepo),
      inject: [
        RefreshTokenRepositoryPort,
        TokenGeneratorPort,
        UserRepositoryPort,
        RoleRepositoryPort,
      ],
    },
    {
      provide: LogoutUseCase,
      useFactory: (refreshRepo: RefreshTokenRepositoryPort) =>
        new LogoutUseCase(refreshRepo),
      inject: [RefreshTokenRepositoryPort],
    },
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule {}
