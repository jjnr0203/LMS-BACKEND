export abstract class DeleteCertificateUseCasePort {
  abstract execute(userId: string, certificateUrl: string): Promise<void>;
}
