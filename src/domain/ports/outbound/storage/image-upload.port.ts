export abstract class ImageUploadPort {
  abstract uploadImage(fileBuffer: Buffer, folder: string): Promise<string>;
  abstract uploadDocument?(
    fileBuffer: Buffer,
    folder: string,
    fileName?: string,
  ): Promise<string>;
}
