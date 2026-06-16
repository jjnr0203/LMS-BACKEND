import { IsString, IsNotEmpty } from 'class-validator';

export class DisableAccountDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
