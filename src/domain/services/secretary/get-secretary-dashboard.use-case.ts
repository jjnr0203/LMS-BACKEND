import { Inject } from '@nestjs/common';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { EnrollmentDetailRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-detail-repository.port';
import { AcademicRecordRepositoryPort } from '@domain/ports/outbound/secretary/academic-record-repository.port';
import { CertificateRepositoryPort } from '@domain/ports/outbound/secretary/certificate-repository.port';

export class GetSecretaryDashboardUseCase {
  constructor(
    private readonly inscriptionRepo: InscriptionRepositoryPort,
    private readonly enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
    private readonly academicRecordRepo: AcademicRecordRepositoryPort,
    private readonly certificateRepo: CertificateRepositoryPort,
  ) {}

  async execute() {
    const inscriptions = await this.inscriptionRepo.findAll();
    const enrollments = await this.enrollmentDetailRepo.findAll();
    const matriculated = new Set(enrollments.map((e) => e.studentId));

    const pendingInscriptions = inscriptions.filter(
      (i) => i.status === 'pending' && !matriculated.has(i.studentId),
    ).length;

    return {
      totalInscriptions: inscriptions.length,
      pendingInscriptions,
      totalEnrollments: matriculated.size,
      totalCertificates: (await this.certificateRepo.findAll()).length,
    };
  }
}
