export abstract class ImageUploadPort {
  abstract uploadImage(fileBuffer: Buffer, folder: string): Promise<string>;
}
