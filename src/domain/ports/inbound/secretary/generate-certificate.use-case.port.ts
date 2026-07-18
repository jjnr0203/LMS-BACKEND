import { CertificateEntity } from '../../../entities/secretary/certificate.entity';

export interface GenerateCertificateCommand {
  studentId: string;
  type: string;
}

export abstract class GenerateCertificateUseCasePort {
  abstract execute(command: GenerateCertificateCommand): Promise<{ certificate: CertificateEntity }>;
}
