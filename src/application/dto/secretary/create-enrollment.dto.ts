import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  academicTermId: string;

  @IsString()
  @IsNotEmpty()
  careerId: string;

  @IsNumber()
  level: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjectIds?: string[];
}
