import { v4 as uuid } from 'uuid';
import { BadRequestException, Inject } from '@nestjs/common';
import {
  GenerateCertificateUseCasePort,
  GenerateCertificateCommand,
} from '@domain/ports/inbound/secretary/generate-certificate.use-case.port';
import { CertificateRepositoryPort } from '@domain/ports/outbound/secretary/certificate-repository.port';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { CertificateEntity } from '@domain/entities/secretary/certificate.entity';
import { PdfGeneratorPort } from '@domain/ports/outbound/storage/pdf-generator.port';
import { ImageUploadPort } from '@domain/ports/outbound/storage/image-upload.port';
import type { InstitutionConfigRepositoryPort } from '@domain/ports/outbound/institution/institution-config-repository.port';
import { CAREER_REPOSITORY } from '@domain/ports/outbound/academic/career-repository.port';
import type { CareerRepositoryPort } from '@domain/ports/outbound/academic/career-repository.port';

export class GenerateCertificateUseCase implements GenerateCertificateUseCasePort {
  constructor(
    private readonly certificateRepo: CertificateRepositoryPort,
    private readonly studentRepo: StudentRepositoryPort,
    private readonly inscriptionRepo: InscriptionRepositoryPort,
    @Inject(CAREER_REPOSITORY)
    private readonly careerRepo: CareerRepositoryPort,
    private readonly pdfGenerator: PdfGeneratorPort,
    private readonly imageUpload: ImageUploadPort,
    private readonly institutionRepo: InstitutionConfigRepositoryPort,
  ) {}

  async execute(
    command: GenerateCertificateCommand,
  ): Promise<{ certificate: CertificateEntity }> {
    const student = await this.studentRepo.findById(command.studentId);
    if (!student) {
      throw new BadRequestException('El estudiante no existe');
    }

    const validTypes = ['matricula'];
    if (!validTypes.includes(command.type)) {
      throw new BadRequestException(
        `Tipo de certificado inválido. Tipos válidos: ${validTypes.join(', ')}`,
      );
    }

    const inscriptions = await this.inscriptionRepo.findByStudentId(
      command.studentId,
    );
    if (!inscriptions.length) {
      throw new BadRequestException(
        'El estudiante no tiene una inscripción registrada',
      );
    }

    const latest = [...inscriptions].sort(
      (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    )[0];

    const career = latest.careerId
      ? await this.careerRepo.findById(latest.careerId)
      : null;
    const careerName = career?.name ?? '';

    const institution = await this.institutionRepo.findOne();
    const address = institution?.address ?? '';
    const city = address.includes(',') ? address.split(',')[0].trim() : 'Quito';

    const certificateId = uuid();
    const generatedAt = new Date();

    if (!this.imageUpload.uploadDocument) {
      throw new Error(
        'uploadDocument method is not implemented in ImageUploadPort',
      );
    }

    const pdfBuffer = await this.pdfGenerator.generateEnrollmentCertificate({
      institutionName: institution?.name ?? 'Institución Educativa',
      institutionSlogan: institution?.slogan ?? undefined,
      institutionRuc: institution?.ruc ?? undefined,
      city,
      studentFullName: `${student.firstName} ${student.lastName}`.trim(),
      studentId: student.id,
      careerName,
      generatedAt,
      certificateCode: certificateId,
    });

    const pdfUrl = await this.imageUpload.uploadDocument(
      pdfBuffer,
      'lms/certificados',
      `certificado-matricula-${student.id}-${Date.now()}`,
    );

    const certificate = new CertificateEntity(
      certificateId,
      command.studentId,
      command.type,
      pdfUrl,
      generatedAt,
    );

    const saved = await this.certificateRepo.save(certificate);
    return { certificate: saved };
  }
}
