import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(10, 10, { message: 'La cédula debe tener exactamente 10 caracteres' })
  id: string; // Cedula

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

  @IsString()
  @IsNotEmpty()
  roleName: string; // 'admin', 'student', 'professor'
}
