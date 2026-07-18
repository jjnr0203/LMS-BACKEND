import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateCertificateDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
