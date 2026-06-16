import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin/admin.controller';
import { CreateUserUseCase } from '../../domain/services/admin/create-user.use-case';
import { UserRepositoryPort } from '../../domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '../../domain/ports/outbound/auth/password-hasher.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [AdminController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
      ) => new CreateUserUseCase(userRepo, roleRepo, hasher),
      inject: [UserRepositoryPort, RoleRepositoryPort, PasswordHasherPort],
    },
  ],
})
export class AdminModule {}
