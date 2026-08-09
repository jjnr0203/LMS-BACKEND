import { TeacherPostgresRepository } from '@infrastructure/adapters/database/repositories/users/teacher-postgres.repository';
import { TeacherRepositoryPort } from '@domain/ports/outbound/users/teacher-repository.port';
import { StudentPostgresRepository } from '@infrastructure/adapters/database/repositories/users/student-postgres.repository';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseModule } from './database.module';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { TokenGeneratorPort } from '@domain/ports/outbound/auth/token-generator.port';
import { RefreshTokenRepositoryPort } from '@domain/ports/outbound/auth/refresh-token-repository.port';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { EnrollmentRepositoryPort } from '@domain/ports/outbound/academic/enrollment-repository.port';
import { AssignmentRepositoryPort } from '@domain/ports/outbound/academic/assignment-repository.port';
import { SubmissionRepositoryPort } from '@domain/ports/outbound/academic/submission-repository.port';
import { StudentSubjectRepositoryPort } from '@domain/ports/outbound/academic/student-subject-repository.port';
import { TeacherSubjectRepositoryPort } from '@domain/ports/outbound/academic/teacher-subject-repository.port';
import { ScheduleRepositoryPort } from '@domain/ports/outbound/academic/schedule-repository.port';
import {
  AcademicTermRepositoryPort,
  ACADEMIC_TERM_REPOSITORY,
} from '@domain/ports/outbound/academic/academic-term-repository.port';
import {
  ModalityRepositoryPort,
  MODALITY_REPOSITORY,
} from '@domain/ports/outbound/academic/modality-repository.port';
import {
  JornadaRepositoryPort,
  JORNADA_REPOSITORY,
} from '@domain/ports/outbound/academic/jornada-repository.port';
import {
  CareerRepositoryPort,
  CAREER_REPOSITORY,
} from '@domain/ports/outbound/academic/career-repository.port';
import {
  CareerSubjectRepositoryPort,
  CAREER_SUBJECT_REPOSITORY,
} from '@domain/ports/outbound/academic/career-subject-repository.port';
import { SemesterColorRepositoryPort } from '@domain/ports/outbound/academic/semester-color-repository.port';
import { COORDINATOR_SUBJECT_COLOR_REPOSITORY } from '@domain/ports/outbound/academic/coordinator-subject-color-repository.port';
import {
  FacultyRepositoryPort,
  FACULTY_REPOSITORY,
} from '@domain/ports/outbound/academic/faculty-repository.port';
import {
  PermissionRepositoryPort,
  PERMISSION_REPOSITORY,
} from '@domain/ports/outbound/academic/permission-repository.port';
import {
  RolePermissionRepositoryPort,
  ROLE_PERMISSION_REPOSITORY,
} from '@domain/ports/outbound/academic/role-permission-repository.port';
import {
  CurriculumRepositoryPort,
  CURRICULUM_REPOSITORY,
} from '@domain/ports/outbound/academic/curriculum-repository.port';
import { UserPostgresRepository } from '@infrastructure/adapters/database/user-postgres.repository';
import { RolePostgresRepository } from '@infrastructure/adapters/database/role-postgres.repository';
import { RefreshTokenPostgresRepository } from '@infrastructure/adapters/database/refresh-token-postgres.repository';
import { TuitionPostgresRepository } from '@infrastructure/adapters/database/academic/tuition-postgres.repository';
import { SubjectPostgresRepository } from '@infrastructure/adapters/database/academic/subject-postgres.repository';
import { EnrollmentPostgresRepository } from '@infrastructure/adapters/database/academic/enrollment-postgres.repository';
import { AssignmentPostgresRepository } from '@infrastructure/adapters/database/academic/assignment-postgres.repository';
import { SubmissionPostgresRepository } from '@infrastructure/adapters/database/academic/submission-postgres.repository';
import { StudentSubjectPostgresRepository } from '@infrastructure/adapters/database/academic/student-subject-postgres.repository';
import { TeacherSubjectPostgresRepository } from '@infrastructure/adapters/database/academic/teacher-subject-postgres.repository';
import { SchedulePostgresRepository } from '@infrastructure/adapters/database/academic/schedule-postgres.repository';
import { AcademicTermPostgresRepository } from '@infrastructure/adapters/database/academic/academic-term-postgres.repository';
import { ModalityPostgresRepository } from '@infrastructure/adapters/database/academic/modality-postgres.repository';
import { JornadaPostgresRepository } from '@infrastructure/adapters/database/academic/jornada-postgres.repository';
import { CareerPostgresRepository } from '@infrastructure/adapters/database/academic/career-postgres.repository';
import { CareerSubjectPostgresRepository } from '@infrastructure/adapters/database/academic/career-subject-postgres.repository';
import { SemesterColorPostgresRepository } from '@infrastructure/adapters/database/academic/semester-color-postgres.repository';
import { CoordinatorSubjectColorPostgresRepository } from '@infrastructure/adapters/database/academic/coordinator-subject-color-postgres.repository';
import { CurriculumPostgresRepository } from '@infrastructure/adapters/database/academic/curriculum-postgres.repository';
import { FacultyPostgresRepository } from '@infrastructure/adapters/database/academic/faculty-postgres.repository';
import { PermissionPostgresRepository } from '@infrastructure/adapters/database/academic/permission-postgres.repository';
import { RolePermissionPostgresRepository } from '@infrastructure/adapters/database/academic/role-permission-postgres.repository';
import { BcryptPasswordHasher } from '@infrastructure/adapters/auth/bcrypt-password-hasher';
import { JwtTokenGenerator } from '@infrastructure/adapters/auth/jwt-token-generator';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>(
            'JWT_EXPIRES_IN',
            '1h',
          ) as unknown as SignOptions['expiresIn'],
        },
      }),
    }),
  ],
  providers: [
    {
      provide: TeacherRepositoryPort,
      useClass: TeacherPostgresRepository,
    },
    {
      provide: StudentRepositoryPort,
      useClass: StudentPostgresRepository,
    },
    {
      provide: UserRepositoryPort,
      useClass: UserPostgresRepository,
    },
    {
      provide: RoleRepositoryPort,
      useClass: RolePostgresRepository,
    },
    {
      provide: RefreshTokenRepositoryPort,
      useClass: RefreshTokenPostgresRepository,
    },
    {
      provide: PasswordHasherPort,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TokenGeneratorPort,
      useFactory: (jwtService: JwtService, configService: ConfigService) =>
        new JwtTokenGenerator(jwtService, configService),
      inject: [JwtService, ConfigService],
    },
    {
      provide: TuitionRepositoryPort,
      useClass: TuitionPostgresRepository,
    },
    {
      provide: SubjectRepositoryPort,
      useClass: SubjectPostgresRepository,
    },
    {
      provide: EnrollmentRepositoryPort,
      useClass: EnrollmentPostgresRepository,
    },
    {
      provide: AssignmentRepositoryPort,
      useClass: AssignmentPostgresRepository,
    },
    {
      provide: SubmissionRepositoryPort,
      useClass: SubmissionPostgresRepository,
    },
    {
      provide: StudentSubjectRepositoryPort,
      useClass: StudentSubjectPostgresRepository,
    },
    {
      provide: TeacherSubjectRepositoryPort,
      useClass: TeacherSubjectPostgresRepository,
    },
    {
      provide: ScheduleRepositoryPort,
      useClass: SchedulePostgresRepository,
    },
    {
      provide: ACADEMIC_TERM_REPOSITORY,
      useClass: AcademicTermPostgresRepository,
    },
    {
      provide: MODALITY_REPOSITORY,
      useClass: ModalityPostgresRepository,
    },
    {
      provide: JORNADA_REPOSITORY,
      useClass: JornadaPostgresRepository,
    },
    {
      provide: CAREER_REPOSITORY,
      useClass: CareerPostgresRepository,
    },
    {
      provide: CAREER_SUBJECT_REPOSITORY,
      useClass: CareerSubjectPostgresRepository,
    },
    {
      provide: FACULTY_REPOSITORY,
      useClass: FacultyPostgresRepository,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PermissionPostgresRepository,
    },
    {
      provide: ROLE_PERMISSION_REPOSITORY,
      useClass: RolePermissionPostgresRepository,
    },
    {
      provide: 'SEMESTER_COLOR_REPOSITORY',
      useClass: SemesterColorPostgresRepository,
    },
    {
      provide: COORDINATOR_SUBJECT_COLOR_REPOSITORY,
      useClass: CoordinatorSubjectColorPostgresRepository,
    },
    {
      provide: CURRICULUM_REPOSITORY,
      useClass: CurriculumPostgresRepository,
    },
    {
      provide: RolesGuard,
      useFactory: (
        reflector: Reflector,
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        rolePermRepo: RolePermissionRepositoryPort,
      ) => new RolesGuard(reflector, userRepo, roleRepo, rolePermRepo),
      inject: [
        Reflector,
        UserRepositoryPort,
        RoleRepositoryPort,
        ROLE_PERMISSION_REPOSITORY,
      ],
    },
  ],
  exports: [
    TeacherRepositoryPort,
    StudentRepositoryPort,
    UserRepositoryPort,
    RoleRepositoryPort,
    RefreshTokenRepositoryPort,
    PasswordHasherPort,
    TokenGeneratorPort,
    TuitionRepositoryPort,
    SubjectRepositoryPort,
    EnrollmentRepositoryPort,
    AssignmentRepositoryPort,
    SubmissionRepositoryPort,
    StudentSubjectRepositoryPort,
    TeacherSubjectRepositoryPort,
    ScheduleRepositoryPort,
    ACADEMIC_TERM_REPOSITORY,
    MODALITY_REPOSITORY,
    JORNADA_REPOSITORY,
    CAREER_REPOSITORY,
    CAREER_SUBJECT_REPOSITORY,
    'SEMESTER_COLOR_REPOSITORY',
    COORDINATOR_SUBJECT_COLOR_REPOSITORY,
    CURRICULUM_REPOSITORY,
    FACULTY_REPOSITORY,
    PERMISSION_REPOSITORY,
    ROLE_PERMISSION_REPOSITORY,
    RolesGuard,
  ],
})
export class RepositoryProvidersModule {}
