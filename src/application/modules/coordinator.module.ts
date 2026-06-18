import { Module } from '@nestjs/common';
import { CoordinatorController } from '../controllers/coordinator/coordinator.controller';
import { RegisterStudentUseCase } from '@domain/services/coordinator/register-student.use-case';
import { RegisterTeacherUseCase } from '@domain/services/coordinator/register-teacher.use-case';
import { CreateSubjectUseCase } from '@domain/services/coordinator/create-subject.use-case';
import { EnrollStudentUseCase } from '@domain/services/coordinator/enroll-student.use-case';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { EnrollmentRepositoryPort } from '@domain/ports/outbound/academic/enrollment-repository.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [CoordinatorController],
  providers: [
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
    {
      provide: RegisterTeacherUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
      ) => new RegisterTeacherUseCase(userRepo, roleRepo, hasher),
      inject: [UserRepositoryPort, RoleRepositoryPort, PasswordHasherPort],
    },
    {
      provide: CreateSubjectUseCase,
      useFactory: (subjectRepo: SubjectRepositoryPort) =>
        new CreateSubjectUseCase(subjectRepo),
      inject: [SubjectRepositoryPort],
    },
    {
      provide: EnrollStudentUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        enrollmentRepo: EnrollmentRepositoryPort,
      ) => new EnrollStudentUseCase(userRepo, enrollmentRepo),
      inject: [UserRepositoryPort, EnrollmentRepositoryPort],
    },
  ],
})
export class CoordinatorModule {}
