import { IsString, IsOptional, IsEmail, MaxLength, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  birthDate?: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  facultyIds?: string[];
}
