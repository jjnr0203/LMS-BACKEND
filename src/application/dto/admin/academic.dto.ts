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
  @IsArray()
  @IsString({ each: true })
  modalityIds?: string[];

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
  @IsArray()
  @IsString({ each: true })
  modalityIds?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  careerId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  semester?: number;
}

export class BulkSubjectItemDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber()
  credits: number;

  @Type(() => Number)
  @IsNumber()
  semester: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  modalityIds?: string[];
}

export class BulkSubjectsDto {
  @IsUUID()
  @IsNotEmpty()
  careerId: string;

  @IsArray()
  @Type(() => BulkSubjectItemDto)
  subjects: BulkSubjectItemDto[];
}
