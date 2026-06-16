import { IsString, IsNotEmpty } from 'class-validator';

export class AssignTeacherDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;
}
