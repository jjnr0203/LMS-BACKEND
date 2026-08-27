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
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { CertificatePaymentStatus } from '@domain/ports/outbound/storage/pdf-generator.port';
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
    private readonly tuitionRepo: TuitionRepositoryPort,
  ) {}

  async execute(
    command: GenerateCertificateCommand,
  ): Promise<{ certificate: CertificateEntity }> {
    const student = await this.studentRepo.findById(command.studentId);
    if (!student) {
      throw new BadRequestException('El estudiante no existe');
    }

    const validTypes = ['matricula', 'pago'];
    if (!validTypes.includes(command.type)) {
      throw new BadRequestException(
        `Tipo de certificado inválido. Tipos válidos: ${validTypes.join(', ')}`,
      );
    }

    const inscriptions = await this.inscriptionRepo.findByStudentId(
      command.studentId,
    );
    if (!inscriptions.length && command.type === 'matricula') {
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

    const tuition = await this.tuitionRepo.findByStudentId(command.studentId);
    let paymentStatus: CertificatePaymentStatus = 'sin_pagos';
    let paidInstallments = 0;
    if (tuition) {
      paidInstallments = tuition.paidInstallments;
      if (tuition.status === 'pago_total' || tuition.paidInstallments >= 4) {
        paymentStatus = 'pagado';
      } else if (tuition.status === 'convenio') {
        paymentStatus = 'pagando';
      } else {
        paymentStatus = 'sin_pagos';
      }
    }

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

    const certificateData = {
      institutionName: institution?.name ?? 'Institución Educativa',
      institutionSlogan: institution?.slogan ?? undefined,
      institutionRuc: institution?.ruc ?? undefined,
      institutionAddress: institution?.address ?? undefined,
      institutionPhone: institution?.phone ?? undefined,
      institutionMobile: institution?.mobile ?? undefined,
      institutionEmail: institution?.email ?? undefined,
      institutionWebsite: institution?.website ?? undefined,
      institutionLogoUrl: institution?.logoUrl ?? undefined,
      city,
      studentFullName: `${student.firstName} ${student.lastName}`.trim(),
      studentId: student.id,
      careerName,
      generatedAt,
      certificateCode: certificateId,
    };

    const isPayment = command.type === 'pago';

    const pdfBuffer = isPayment
      ? await this.pdfGenerator.generatePaymentCertificate({
          ...certificateData,
          paymentStatus,
          paidInstallments,
        })
      : await this.pdfGenerator.generateEnrollmentCertificate(certificateData);

    const pdfUrl = await this.imageUpload.uploadDocument(
      pdfBuffer,
      'lms/certificados',
      `${isPayment ? 'certificado-pago' : 'certificado-matricula'}-${student.id}-${Date.now()}`,
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
