import { Module } from '@nestjs/common';
import { TreasuryController } from '../controllers/treasury/treasury.controller';
import { ListTuitionsUseCase } from '@domain/services/treasury/list-tuitions.use-case';
import { RegisterPaymentUseCase } from '@domain/services/treasury/register-payment.use-case';
import { DisableAccountUseCase } from '@domain/services/treasury/disable-account.use-case';
import { RegisterStudentUseCase } from '@domain/services/treasury/register-student.use-case';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [TreasuryController],
  providers: [
    {
      provide: ListTuitionsUseCase,
      useFactory: (tuitionRepo: TuitionRepositoryPort) =>
        new ListTuitionsUseCase(tuitionRepo),
      inject: [TuitionRepositoryPort],
    },
    {
      provide: RegisterPaymentUseCase,
      useFactory: (tuitionRepo: TuitionRepositoryPort) =>
        new RegisterPaymentUseCase(tuitionRepo),
      inject: [TuitionRepositoryPort],
    },
    {
      provide: DisableAccountUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        tuitionRepo: TuitionRepositoryPort,
      ) => new DisableAccountUseCase(userRepo, tuitionRepo),
      inject: [UserRepositoryPort, TuitionRepositoryPort],
    },
    {
      provide: RegisterStudentUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
        tuitionRepo: TuitionRepositoryPort,
      ) => new RegisterStudentUseCase(userRepo, roleRepo, hasher, tuitionRepo),
      inject: [
        UserRepositoryPort,
        RoleRepositoryPort,
        PasswordHasherPort,
        TuitionRepositoryPort,
      ],
    },
  ],
})
export class TreasuryModule {}
