import { IsString, IsNotEmpty, IsBoolean, IsDate, IsNumber, IsOptional, IsArray, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAcademicTermDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsBoolean()
  isActive: boolean;
}

export class CreateModalityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  modalityId?: string;

  @IsOptional()
  @IsString()
  coordinatorId: string;

  @Type(() => Number)
  @IsNumber()
  durationSemesters: number;

  @IsBoolean()
  isActive: boolean;
}

export class AssignSubjectsDto {
  @IsArray()
  @IsString({ each: true })
  subjectIds: string[];
}

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  credits: number;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
