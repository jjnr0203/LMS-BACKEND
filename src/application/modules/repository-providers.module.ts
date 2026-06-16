import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserRepositoryPort } from '../../domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '../../domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '../../domain/ports/outbound/auth/password-hasher.port';
import { TokenGeneratorPort } from '../../domain/ports/outbound/auth/token-generator.port';
import { RefreshTokenRepositoryPort } from '../../domain/ports/outbound/auth/refresh-token-repository.port';
import { TuitionRepositoryPort } from '../../domain/ports/outbound/academic/tuition-repository.port';
import { SubjectRepositoryPort } from '../../domain/ports/outbound/academic/subject-repository.port';
import { EnrollmentRepositoryPort } from '../../domain/ports/outbound/academic/enrollment-repository.port';
import { AssignmentRepositoryPort } from '../../domain/ports/outbound/academic/assignment-repository.port';
import { SubmissionRepositoryPort } from '../../domain/ports/outbound/academic/submission-repository.port';
import { StudentSubjectRepositoryPort } from '../../domain/ports/outbound/academic/student-subject-repository.port';
import { UserPostgresRepository } from '../../infrastructure/adapters/database/user-postgres.repository';
import { RolePostgresRepository } from '../../infrastructure/adapters/database/role-postgres.repository';
import { RefreshTokenPostgresRepository } from '../../infrastructure/adapters/database/refresh-token-postgres.repository';
import { TuitionPostgresRepository } from '../../infrastructure/adapters/database/academic/tuition-postgres.repository';
import { SubjectPostgresRepository } from '../../infrastructure/adapters/database/academic/subject-postgres.repository';
import { EnrollmentPostgresRepository } from '../../infrastructure/adapters/database/academic/enrollment-postgres.repository';
import { AssignmentPostgresRepository } from '../../infrastructure/adapters/database/academic/assignment-postgres.repository';
import { SubmissionPostgresRepository } from '../../infrastructure/adapters/database/academic/submission-postgres.repository';
import { StudentSubjectPostgresRepository } from '../../infrastructure/adapters/database/academic/student-subject-postgres.repository';
import { BcryptPasswordHasher } from '../../infrastructure/adapters/auth/bcrypt-password-hasher';
import { JwtTokenGenerator } from '../../infrastructure/adapters/auth/jwt-token-generator';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { SignOptions } from 'jsonwebtoken';
import { RolesGuard } from '../../infrastructure/auth/guards/roles.guard';
import { SeedService } from '../../infrastructure/seed/seed.service';

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
    RolesGuard,
    SeedService,
  ],
  exports: [
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
    RolesGuard,
  ],
})
export class RepositoryProvidersModule {}
