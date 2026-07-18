import { v4 as uuid } from 'uuid';
import { GenerateCertificateUseCasePort, GenerateCertificateCommand } from '@domain/ports/inbound/secretary/generate-certificate.use-case.port';
import { CertificateRepositoryPort } from '@domain/ports/outbound/secretary/certificate-repository.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { CertificateEntity } from '@domain/entities/secretary/certificate.entity';
import { BadRequestException } from '@nestjs/common';

export class GenerateCertificateUseCase implements GenerateCertificateUseCasePort {
  constructor(
    private readonly certificateRepo: CertificateRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: GenerateCertificateCommand): Promise<{ certificate: CertificateEntity }> {
    const student = await this.userRepo.findById(command.studentId);
    if (!student) {
      throw new BadRequestException('El estudiante no existe');
    }

    const validTypes = ['matricula', 'estudios', 'notas', 'egreso'];
    if (!validTypes.includes(command.type)) {
      throw new BadRequestException(`Tipo de certificado inválido. Tipos válidos: ${validTypes.join(', ')}`);
    }

    const certificate = new CertificateEntity(
      uuid(),
      command.studentId,
      command.type,
      undefined,
      new Date(),
    );

    const saved = await this.certificateRepo.save(certificate);
    return { certificate: saved };
  }
}
