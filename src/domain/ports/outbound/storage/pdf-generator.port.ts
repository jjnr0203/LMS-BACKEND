export interface EnrollmentCertificateData {
  institutionName: string;
  institutionSlogan?: string;
  institutionRuc?: string;
  city: string;
  studentFullName: string;
  studentId: string;
  careerName: string;
  generatedAt: Date;
  certificateCode: string;
}

export abstract class PdfGeneratorPort {
  abstract generateEnrollmentCertificate(
    data: EnrollmentCertificateData,
  ): Promise<Buffer>;
}
