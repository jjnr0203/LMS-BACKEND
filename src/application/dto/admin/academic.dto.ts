import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
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

export class CreateJornadaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
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
  @IsArray()
  @IsString({ each: true })
  jornadaIds?: string[];

  @IsOptional()
  @IsString()
  coordinatorId: string;

  @IsOptional()
  @IsString()
  facultyId?: string;

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
  @Type(() => Number)
  @IsNumber()
  hours?: number;

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

  @IsOptional()
  @IsString()
  curriculumId?: string;
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hours?: number;

  @IsOptional()
  @IsString()
  curriculumId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  successorCodes?: string[];
}

export class UpdatePrerequisitesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  prerequisiteIds!: string[];
}

export class UpdateSuccessorsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  successorIds!: string[];
}

export class BulkSubjectsDto {
  @IsUUID()
  @IsNotEmpty()
  careerId: string;

  @IsArray()
  @Type(() => BulkSubjectItemDto)
  subjects: BulkSubjectItemDto[];

  @IsOptional()
  @IsString()
  curriculumId?: string;
}

export class CreateCurriculumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsBoolean()
  isActive: boolean;
}

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  resource: string;
}

export class AssignPermissionsDto {
  @IsArray()
  @IsString({ each: true })
  permissionIds: string[];
}
