import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { ImageUploadPort } from '@domain/ports/outbound/storage/image-upload.port';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryAdapter implements ImageUploadPort {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(fileBuffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result.secure_url);
        },
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
  async uploadDocument(
    fileBuffer: Buffer,
    folder: string,
    fileName?: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const options: any = { folder, resource_type: 'auto' };
      if (fileName) {
        const cleanName = fileName.replace(/\.[^/.]+$/, ''); // Remove extension
        options.public_id = cleanName;
        options.use_filename = true;
        options.unique_filename = false;
      }
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result.secure_url);
        },
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
}
