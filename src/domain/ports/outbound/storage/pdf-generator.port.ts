export type CertificatePaymentStatus = 'pagado' | 'pagando' | 'sin_pagos';

export interface EnrollmentCertificateData {
  institutionName: string;
  institutionSlogan?: string;
  institutionRuc?: string;
  institutionAddress?: string;
  institutionPhone?: string;
  institutionMobile?: string;
  institutionEmail?: string;
  institutionWebsite?: string;
  institutionLogoUrl?: string;
  city: string;
  studentFullName: string;
  studentId: string;
  careerName: string;
  generatedAt: Date;
  certificateCode: string;
}

export interface PaymentCertificateData extends EnrollmentCertificateData {
  paymentStatus: CertificatePaymentStatus;
  paidInstallments: number;
}

export abstract class PdfGeneratorPort {
  abstract generateEnrollmentCertificate(
    data: EnrollmentCertificateData,
  ): Promise<Buffer>;

  abstract generatePaymentCertificate(
    data: PaymentCertificateData,
  ): Promise<Buffer>;
}
