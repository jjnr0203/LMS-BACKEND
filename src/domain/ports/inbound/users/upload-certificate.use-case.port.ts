export abstract class UploadCertificateUseCasePort {
  abstract execute(
    userId: string,
    fileBuffer: Buffer,
    fileName?: string,
  ): Promise<{ certificateUrl: string }>;
}
