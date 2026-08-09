import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateInscriptionDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  careerId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
