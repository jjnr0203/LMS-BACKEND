import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as ReqDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/guards/roles.guard';
import { Roles } from '../../../infrastructure/auth/decorators/roles.decorator';
import { RegisterStudentUseCase } from '../../../domain/services/coordinator/register-student.use-case';
import { RegisterTeacherUseCase } from '../../../domain/services/coordinator/register-teacher.use-case';
import { CreateSubjectUseCase } from '../../../domain/services/coordinator/create-subject.use-case';
import { EnrollStudentUseCase } from '../../../domain/services/coordinator/enroll-student.use-case';
import { RegisterStudentDto } from '../../dto/coordinator/register-student.dto';
import { RegisterTeacherDto } from '../../dto/coordinator/register-teacher.dto';
import { CreateSubjectDto } from '../../dto/coordinator/create-subject.dto';
import { AdminResponseDto } from '../../dto/admin/admin-response.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('coordinador')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('coordinador')
export class CoordinatorController {
  constructor(
    private readonly registerStudentUseCase: RegisterStudentUseCase,
    private readonly registerTeacherUseCase: RegisterTeacherUseCase,
    private readonly createSubjectUseCase: CreateSubjectUseCase,
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
  ) {}

  @Post('estudiantes')
  async registerStudent(@Body() dto: RegisterStudentDto) {
    const { user, tuition } = await this.registerStudentUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
    });
    return {
      message: 'Estudiante registrado exitosamente',
      user: AdminResponseDto.fromEntity(user),
      tuition: {
        status: tuition.status,
        paidInstallments: tuition.paidInstallments,
      },
    };
  }

  @Post('docentes')
  async registerTeacher(@Body() dto: RegisterTeacherDto) {
    const { user } = await this.registerTeacherUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
    });
    return {
      message: 'Docente registrado exitosamente',
      user: AdminResponseDto.fromEntity(user),
    };
  }

  @Post('materias')
  async createSubject(
    @Body() dto: CreateSubjectDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    const { subject } = await this.createSubjectUseCase.execute({
      name: dto.name,
      code: dto.code,
      credits: dto.credits,
      coordinatorId: req.user.id,
      description: dto.description,
    });
    return { message: 'Materia creada exitosamente', subject };
  }

  @Post('matricular')
  async enrollStudent(@Body() body: { studentId: string }) {
    const { enrollment } = await this.enrollStudentUseCase.execute(
      body.studentId,
    );
    return {
      message: 'Estudiante matriculado en la carrera exitosamente',
      enrollment,
    };
  }
}
