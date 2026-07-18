import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretaryController } from '../controllers/secretary/secretary.controller';
import { CreateInscriptionUseCase } from '@domain/services/secretary/create-inscription.use-case';
import { CreateEnrollmentUseCase } from '@domain/services/secretary/create-enrollment.use-case';
import { GetAcademicHistoryUseCase } from '@domain/services/secretary/get-academic-history.use-case';
import { GenerateCertificateUseCase } from '@domain/services/secretary/generate-certificate.use-case';
import { GetSecretaryDashboardUseCase } from '@domain/services/secretary/get-secretary-dashboard.use-case';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { EnrollmentDetailRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-detail-repository.port';
import { EnrollmentSubjectRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-subject-repository.port';
import { AcademicRecordRepositoryPort } from '@domain/ports/outbound/secretary/academic-record-repository.port';
import { CertificateRepositoryPort } from '@domain/ports/outbound/secretary/certificate-repository.port';
import { InscriptionPostgresRepository } from '@infrastructure/adapters/database/secretary/inscription-postgres.repository';
import { EnrollmentDetailPostgresRepository } from '@infrastructure/adapters/database/secretary/enrollment-detail-postgres.repository';
import { EnrollmentSubjectPostgresRepository } from '@infrastructure/adapters/database/secretary/enrollment-subject-postgres.repository';
import { AcademicRecordPostgresRepository } from '@infrastructure/adapters/database/secretary/academic-record-postgres.repository';
import { CertificatePostgresRepository } from '@infrastructure/adapters/database/secretary/certificate-postgres.repository';
import { InscriptionOrmEntity } from '@infrastructure/database/entities/secretary/inscription.orm-entity';
import { EnrollmentDetailOrmEntity } from '@infrastructure/database/entities/secretary/enrollment-detail.orm-entity';
import { EnrollmentSubjectOrmEntity } from '@infrastructure/database/entities/secretary/enrollment-subject.orm-entity';
import { AcademicRecordOrmEntity } from '@infrastructure/database/entities/secretary/academic-record.orm-entity';
import { CertificateOrmEntity } from '@infrastructure/database/entities/secretary/certificate.orm-entity';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { ACADEMIC_TERM_REPOSITORY } from '@domain/ports/outbound/academic/academic-term-repository.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [
    RepositoryProvidersModule,
    TypeOrmModule.forFeature([
      InscriptionOrmEntity,
      EnrollmentDetailOrmEntity,
      EnrollmentSubjectOrmEntity,
      AcademicRecordOrmEntity,
      CertificateOrmEntity,
    ]),
  ],
  controllers: [SecretaryController],
  providers: [
    {
      provide: InscriptionRepositoryPort,
      useClass: InscriptionPostgresRepository,
    },
    {
      provide: EnrollmentDetailRepositoryPort,
      useClass: EnrollmentDetailPostgresRepository,
    },
    {
      provide: EnrollmentSubjectRepositoryPort,
      useClass: EnrollmentSubjectPostgresRepository,
    },
    {
      provide: AcademicRecordRepositoryPort,
      useClass: AcademicRecordPostgresRepository,
    },
    {
      provide: CertificateRepositoryPort,
      useClass: CertificatePostgresRepository,
    },
    {
      provide: CreateInscriptionUseCase,
      useFactory: (
        inscriptionRepo: InscriptionRepositoryPort,
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
      ) => new CreateInscriptionUseCase(inscriptionRepo, userRepo, roleRepo, hasher),
      inject: [InscriptionRepositoryPort, UserRepositoryPort, RoleRepositoryPort, PasswordHasherPort],
    },
    {
      provide: CreateEnrollmentUseCase,
      useFactory: (
        enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
        enrollmentSubjectRepo: EnrollmentSubjectRepositoryPort,
        userRepo: UserRepositoryPort,
      ) => new CreateEnrollmentUseCase(enrollmentDetailRepo, enrollmentSubjectRepo, userRepo),
      inject: [EnrollmentDetailRepositoryPort, EnrollmentSubjectRepositoryPort, UserRepositoryPort],
    },
    {
      provide: GetAcademicHistoryUseCase,
      useFactory: (
        academicRecordRepo: AcademicRecordRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
        academicTermRepo: any,
      ) => new GetAcademicHistoryUseCase(academicRecordRepo, subjectRepo, academicTermRepo),
      inject: [AcademicRecordRepositoryPort, SubjectRepositoryPort, ACADEMIC_TERM_REPOSITORY],
    },
    {
      provide: GenerateCertificateUseCase,
      useFactory: (
        certificateRepo: CertificateRepositoryPort,
        userRepo: UserRepositoryPort,
      ) => new GenerateCertificateUseCase(certificateRepo, userRepo),
      inject: [CertificateRepositoryPort, UserRepositoryPort],
    },
    {
      provide: GetSecretaryDashboardUseCase,
      useFactory: (
        inscriptionRepo: InscriptionRepositoryPort,
        enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
        academicRecordRepo: AcademicRecordRepositoryPort,
        certificateRepo: CertificateRepositoryPort,
      ) => new GetSecretaryDashboardUseCase(inscriptionRepo, enrollmentDetailRepo, academicRecordRepo, certificateRepo),
      inject: [InscriptionRepositoryPort, EnrollmentDetailRepositoryPort, AcademicRecordRepositoryPort, CertificateRepositoryPort],
    },
  ],
})
export class SecretaryModule {}
