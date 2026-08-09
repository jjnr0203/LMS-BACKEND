import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretaryController } from '../controllers/secretary/secretary.controller';
import { CreateInscriptionUseCase } from '@domain/services/secretary/create-inscription.use-case';
import { CreateEnrollmentUseCase } from '@domain/services/secretary/create-enrollment.use-case';
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
import { InstitutionConfigOrmEntity } from '@infrastructure/database/entities/institution/institution-config.orm-entity';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { PdfGeneratorPort } from '@domain/ports/outbound/storage/pdf-generator.port';
import { PdfkitPdfGeneratorAdapter } from '@infrastructure/adapters/storage/pdfkit-pdf-generator.adapter';
import { ImageUploadPort } from '@domain/ports/outbound/storage/image-upload.port';
import { CloudinaryAdapter } from '@infrastructure/adapters/storage/cloudinary.adapter';
import { InstitutionConfigPostgresRepository } from '@infrastructure/adapters/database/repositories/institution/institution-config-postgres.repository';
import { CAREER_REPOSITORY } from '@domain/ports/outbound/academic/career-repository.port';
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
      InstitutionConfigOrmEntity,
    ]),
  ],
  controllers: [SecretaryController],
  providers: [
    {
      provide: PdfGeneratorPort,
      useClass: PdfkitPdfGeneratorAdapter,
    },
    {
      provide: ImageUploadPort,
      useClass: CloudinaryAdapter,
    },
    {
      provide: InstitutionConfigPostgresRepository,
      useClass: InstitutionConfigPostgresRepository,
    },
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
        studentRepo: StudentRepositoryPort,
      ) => new CreateInscriptionUseCase(inscriptionRepo, studentRepo),
      inject: [InscriptionRepositoryPort, StudentRepositoryPort],
    },
    {
      provide: CreateEnrollmentUseCase,
      useFactory: (
        enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
        enrollmentSubjectRepo: EnrollmentSubjectRepositoryPort,
        studentRepo: StudentRepositoryPort,
      ) =>
        new CreateEnrollmentUseCase(
          enrollmentDetailRepo,
          enrollmentSubjectRepo,
          studentRepo,
        ),
      inject: [
        EnrollmentDetailRepositoryPort,
        EnrollmentSubjectRepositoryPort,
        StudentRepositoryPort,
      ],
    },
    {
      provide: GenerateCertificateUseCase,
      useFactory: (
        certificateRepo: CertificateRepositoryPort,
        studentRepo: StudentRepositoryPort,
        inscriptionRepo: InscriptionRepositoryPort,
        careerRepo: any,
        pdfGenerator: PdfGeneratorPort,
        imageUpload: ImageUploadPort,
        institutionRepo: InstitutionConfigPostgresRepository,
      ) =>
        new GenerateCertificateUseCase(
          certificateRepo,
          studentRepo,
          inscriptionRepo,
          careerRepo,
          pdfGenerator,
          imageUpload,
          institutionRepo,
        ),
      inject: [
        CertificateRepositoryPort,
        StudentRepositoryPort,
        InscriptionRepositoryPort,
        CAREER_REPOSITORY,
        PdfGeneratorPort,
        ImageUploadPort,
        InstitutionConfigPostgresRepository,
      ],
    },
    {
      provide: GetSecretaryDashboardUseCase,
      useFactory: (
        inscriptionRepo: InscriptionRepositoryPort,
        enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
        academicRecordRepo: AcademicRecordRepositoryPort,
        certificateRepo: CertificateRepositoryPort,
      ) =>
        new GetSecretaryDashboardUseCase(
          inscriptionRepo,
          enrollmentDetailRepo,
          academicRecordRepo,
          certificateRepo,
        ),
      inject: [
        InscriptionRepositoryPort,
        EnrollmentDetailRepositoryPort,
        AcademicRecordRepositoryPort,
        CertificateRepositoryPort,
      ],
    },
  ],
})
export class SecretaryModule {}
