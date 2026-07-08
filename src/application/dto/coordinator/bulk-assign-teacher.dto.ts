import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TeacherAssignmentDto {
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsArray()
  @IsString({ each: true })
  modalityIds: string[];

  @IsArray()
  @IsString({ each: true })
  jornadaIds: string[];
}

export class SubjectAssignmentsDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeacherAssignmentDto)
  assignments: TeacherAssignmentDto[];
}

export class BulkAssignTeacherDto {
  @IsString()
  @IsOptional()
  curriculumId?: string;

  @IsString()
  @IsNotEmpty()
  academicTermId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubjectAssignmentsDto)
  subjects: SubjectAssignmentsDto[];
}
