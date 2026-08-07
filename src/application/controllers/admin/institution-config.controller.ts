import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { ManageInstitutionConfigUseCase } from '@domain/services/institution/manage-institution-config.use-case';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

import { IsOptional, IsString } from 'class-validator';

export class UpdateInstitutionConfigDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  website?: string;
}

@Controller('admin/institution')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class InstitutionConfigController {
  constructor(private readonly useCase: ManageInstitutionConfigUseCase) {}

  @Get()
  async get() {
    const config = await this.useCase.get();
    return { config };
  }

  @Put()
  async update(@Body() dto: UpdateInstitutionConfigDto) {
    const config = await this.useCase.upsert(dto);
    return { message: 'Configuración actualizada exitosamente', config };
  }

  @Post('logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'institution', resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });

    // Save logoUrl to config
    const config = await this.useCase.upsert({ logoUrl: uploadResult.secure_url });
    return { message: 'Logo subido exitosamente', logoUrl: uploadResult.secure_url, config };
  }
}
