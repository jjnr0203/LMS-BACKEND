import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin/admin.controller';
import { CreateUserUseCase } from '@domain/services/admin/create-user.use-case';
import { GetDashboardStatsUseCase } from '@domain/services/admin/get-dashboard-stats.use-case';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { RepositoryProvidersModule } from './repository-providers.module';
import { AdminAcademicController } from '../controllers/admin/admin-academic.controller';
import { ManageAcademicTermsUseCase } from '@domain/services/admin/academic/manage-academic-terms.use-case';
import { ManageModalitiesUseCase } from '@domain/services/admin/academic/manage-modalities.use-case';
import { ManageCareersUseCase } from '@domain/services/admin/academic/manage-careers.use-case';
import { ManageSubjectsUseCase } from '@domain/services/admin/academic/manage-subjects.use-case';
import { AcademicTermRepositoryPort, ACADEMIC_TERM_REPOSITORY } from '@domain/ports/outbound/academic/academic-term-repository.port';
import { ModalityRepositoryPort, MODALITY_REPOSITORY } from '@domain/ports/outbound/academic/modality-repository.port';
import { CareerRepositoryPort, CAREER_REPOSITORY } from '@domain/ports/outbound/academic/career-repository.port';
import { CareerSubjectRepositoryPort, CAREER_SUBJECT_REPOSITORY } from '@domain/ports/outbound/academic/career-subject-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [AdminController, AdminAcademicController],
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
    {
      provide: GetDashboardStatsUseCase,
      useFactory: (userRepo: UserRepositoryPort) => new GetDashboardStatsUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: ManageAcademicTermsUseCase,
      useFactory: (repo: AcademicTermRepositoryPort) => new ManageAcademicTermsUseCase(repo),
      inject: [ACADEMIC_TERM_REPOSITORY],
    },
    {
      provide: ManageModalitiesUseCase,
      useFactory: (repo: ModalityRepositoryPort) => new ManageModalitiesUseCase(repo),
      inject: [MODALITY_REPOSITORY],
    },
    {
      provide: ManageCareersUseCase,
      useFactory: (careerRepo: CareerRepositoryPort, careerSubjRepo: CareerSubjectRepositoryPort) => new ManageCareersUseCase(careerRepo, careerSubjRepo),
      inject: [CAREER_REPOSITORY, CAREER_SUBJECT_REPOSITORY],
    },
    {
      provide: ManageSubjectsUseCase,
      useFactory: (repo: SubjectRepositoryPort) => new ManageSubjectsUseCase(repo),
      inject: [SubjectRepositoryPort],
    },
  ],
})
export class AdminModule {}
