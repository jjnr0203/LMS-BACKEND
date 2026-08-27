import { CertificateEntity } from '../../../entities/secretary/certificate.entity';

export abstract class CertificateRepositoryPort {
  abstract findById(id: string): Promise<CertificateEntity | null>;
  abstract findByStudentId(studentId: string): Promise<CertificateEntity[]>;
  abstract findAll(): Promise<CertificateEntity[]>;
  abstract save(certificate: CertificateEntity): Promise<CertificateEntity>;
}
