import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  emailOrCedula: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  passwordRaw: string;
}
