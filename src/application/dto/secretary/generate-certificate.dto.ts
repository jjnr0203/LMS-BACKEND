import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class GenerateCertificateDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsOptional()
  @IsString()
  @IsIn(['matricula'])
  type?: string;
}
