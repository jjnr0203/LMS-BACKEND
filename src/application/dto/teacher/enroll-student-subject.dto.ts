import { IsString, IsNotEmpty } from 'class-validator';

export class EnrollStudentSubjectDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;
}
