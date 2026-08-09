import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';
import { HumanResourcesController } from '../controllers/human-resources/human-resources.controller';
import { CreateUserUseCase } from '@domain/services/admin/create-user.use-case';
import { GetPaginatedUsersUseCase } from '@domain/services/users/get-paginated-users.use-case';
import { GetDashboardStatsUseCase } from '@domain/services/admin/get-dashboard-stats.use-case';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { MailerService } from '@nestjs-modules/mailer';
import { RepositoryProvidersModule } from './repository-providers.module';
import { TeacherRepositoryPort } from '@domain/ports/outbound/users/teacher-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import {
  CAREER_REPOSITORY,
  CareerRepositoryPort,
} from '@domain/ports/outbound/academic/career-repository.port';
import {
  MODALITY_REPOSITORY,
  ModalityRepositoryPort,
} from '@domain/ports/outbound/academic/modality-repository.port';
import {
  CURRICULUM_REPOSITORY,
  CurriculumRepositoryPort,
} from '@domain/ports/outbound/academic/curriculum-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import {
  FACULTY_REPOSITORY,
  FacultyRepositoryPort,
} from '@domain/ports/outbound/academic/faculty-repository.port';

@Module({
  imports: [DatabaseModule, AuthModule, RepositoryProvidersModule],
  controllers: [HumanResourcesController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
        mailerService: MailerService,
      ) => new CreateUserUseCase(userRepo, roleRepo, hasher, mailerService),
      inject: [
        UserRepositoryPort,
        RoleRepositoryPort,
        PasswordHasherPort,
        MailerService,
      ],
    },
    {
      provide: GetPaginatedUsersUseCase,
      useFactory: (userRepo: UserRepositoryPort) =>
        new GetPaginatedUsersUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: GetDashboardStatsUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        careerRepo: CareerRepositoryPort,
        modalityRepo: ModalityRepositoryPort,
        curriculumRepo: CurriculumRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
        facultyRepo: FacultyRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
        studentRepo: StudentRepositoryPort,
      ) =>
        new GetDashboardStatsUseCase(
          userRepo,
          careerRepo,
          modalityRepo,
          curriculumRepo,
          subjectRepo,
          facultyRepo,
          teacherRepo,
          studentRepo,
        ),
      inject: [
        UserRepositoryPort,
        CAREER_REPOSITORY,
        MODALITY_REPOSITORY,
        CURRICULUM_REPOSITORY,
        SubjectRepositoryPort,
        FACULTY_REPOSITORY,
        TeacherRepositoryPort,
        StudentRepositoryPort,
      ],
    },
  ],
})
export class HumanResourcesModule {}
