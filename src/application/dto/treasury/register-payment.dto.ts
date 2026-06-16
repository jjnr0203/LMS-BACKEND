import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterPaymentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;
}
