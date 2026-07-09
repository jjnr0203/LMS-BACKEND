import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Length,
} from 'class-validator';

import { IsOptional, IsDate, IsArray } from 'class-validator';

export class RegisterTeacherDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 caracteres' })
  id: string;

  @IsOptional()
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  phone?: string;

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
  @MinLength(6)
  password: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facultyIds?: string[];
}
