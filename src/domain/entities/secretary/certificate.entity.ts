export class CertificateEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly type: string,
    public readonly pdfUrl?: string,
    public readonly generatedAt?: Date,
    public readonly createdAt?: Date,
  ) {}
}
