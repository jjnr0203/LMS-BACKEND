import { Module } from '@nestjs/common';
import { TreasuryController } from '../controllers/treasury/treasury.controller';
import { ListMatriculasUseCase } from '@domain/services/treasury/list-matriculas.use-case';
import { RegisterPaymentUseCase } from '@domain/services/treasury/register-payment.use-case';
import { CompleteTuitionUseCase } from '@domain/services/treasury/complete-tuition.use-case';
import { CreateConvenioUseCase } from '@domain/services/treasury/create-convenio.use-case';
import { DisableAccountUseCase } from '@domain/services/treasury/disable-account.use-case';
import { GetTreasuryDashboardUseCase } from '@domain/services/treasury/get-treasury-dashboard.use-case';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [TreasuryController],
  providers: [
    {
      provide: ListMatriculasUseCase,
      useFactory: (
        studentRepo: StudentRepositoryPort,
        tuitionRepo: TuitionRepositoryPort,
      ) => new ListMatriculasUseCase(studentRepo, tuitionRepo),
      inject: [StudentRepositoryPort, TuitionRepositoryPort],
    },
    {
      provide: GetTreasuryDashboardUseCase,
      useFactory: (tuitionRepo: TuitionRepositoryPort) =>
        new GetTreasuryDashboardUseCase(tuitionRepo),
      inject: [TuitionRepositoryPort],
    },
    {
      provide: RegisterPaymentUseCase,
      useFactory: (tuitionRepo: TuitionRepositoryPort) =>
        new RegisterPaymentUseCase(tuitionRepo),
      inject: [TuitionRepositoryPort],
    },
    {
      provide: CompleteTuitionUseCase,
      useFactory: (tuitionRepo: TuitionRepositoryPort) =>
        new CompleteTuitionUseCase(tuitionRepo),
      inject: [TuitionRepositoryPort],
    },
    {
      provide: CreateConvenioUseCase,
      useFactory: (tuitionRepo: TuitionRepositoryPort) =>
        new CreateConvenioUseCase(tuitionRepo),
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
  ],
})
export class TreasuryModule {}
