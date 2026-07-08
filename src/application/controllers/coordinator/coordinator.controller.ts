import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request as ReqDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { CreateSubjectUseCase } from '@domain/services/coordinator/create-subject.use-case';
import { EnrollStudentUseCase } from '@domain/services/coordinator/enroll-student.use-case';
import { AssignTeacherUseCase } from '@domain/services/coordinator/assign-teacher.use-case';
import { ListSubjectsUseCase } from '@domain/services/coordinator/list-subjects.use-case';
import { RegisterTeacherUseCasePort } from '@domain/ports/inbound/coordinator/register-teacher.use-case.port';
import { GetCoordinatorDashboardUseCase } from '@domain/services/coordinator/get-coordinator-dashboard.use-case';
import { GetCareerDetailUseCase } from '@domain/services/coordinator/get-career-detail.use-case';
import { UnassignTeacherUseCase } from '@domain/services/coordinator/unassign-teacher.use-case';
import { ManageAcademicTermsUseCase } from '@domain/services/admin/academic/manage-academic-terms.use-case';
import { ManageModalitiesUseCase } from '@domain/services/admin/academic/manage-modalities.use-case';
import { ManageJornadasUseCase } from '@domain/services/admin/academic/manage-jornadas.use-case';
import { BulkAssignTeacherUseCase } from '@domain/services/coordinator/bulk-assign-teacher.use-case';
import { ManageSchedulesUseCase } from '@domain/services/coordinator/manage-schedules.use-case';
import { CreateSubjectDto } from '../../dto/coordinator/create-subject.dto';
import { RegisterTeacherDto } from '../../dto/coordinator/register-teacher.dto';
import { BulkAssignTeacherDto } from '../../dto/coordinator/bulk-assign-teacher.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('coordinator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('coordinator')
export class CoordinatorController {
  constructor(
    private readonly createSubjectUseCase: CreateSubjectUseCase,
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
    private readonly assignTeacherUseCase: AssignTeacherUseCase,
    private readonly listSubjectsUseCase: ListSubjectsUseCase,
    private readonly registerTeacherUseCase: RegisterTeacherUseCasePort,
    private readonly getCoordinatorDashboardUseCase: GetCoordinatorDashboardUseCase,
    private readonly getCareerDetailUseCase: GetCareerDetailUseCase,
    private readonly unassignTeacherUseCase: UnassignTeacherUseCase,
    private readonly manageTermsUseCase: ManageAcademicTermsUseCase,
    private readonly manageModalitiesUseCase: ManageModalitiesUseCase,
    private readonly manageJornadasUseCase: ManageJornadasUseCase,
    private readonly bulkAssignTeacherUseCase: BulkAssignTeacherUseCase,
    private readonly manageSchedulesUseCase: ManageSchedulesUseCase,
  ) {}

  @Post('asignar-docente')
  async assignTeacher(
    @Body() body: { 
      teacherId: string; 
      subjectId: string; 
      curriculumId?: string;
      academicTermId?: string;
      modalityId?: string;
      jornadaId?: string;
    },
  ) {
    await this.assignTeacherUseCase.execute({
      teacherId: body.teacherId,
      subjectId: body.subjectId,
      curriculumId: body.curriculumId,
      academicTermId: body.academicTermId,
      modalityId: body.modalityId,
      jornadaId: body.jornadaId,
    });
    return { message: 'Docente asignado a la materia exitosamente' };
  }

  @Post('ofertar-semestre')
  async bulkAssignTeachers(@Body() body: BulkAssignTeacherDto) {
    await this.bulkAssignTeacherUseCase.execute({
      curriculumId: body.curriculumId,
      academicTermId: body.academicTermId,
      subjects: body.subjects,
    });
    return { message: 'Oferta académica guardada exitosamente' };
  }

  @Post('quitar-docente')
  async unassignTeacher(
    @Body() body: { subjectId: string; curriculumId?: string; assignmentId?: string },
  ) {
    await this.unassignTeacherUseCase.execute(
      body.subjectId,
      body.curriculumId,
      body.assignmentId,
    );
    return { message: 'Docente removido de la materia' };
  }

  @Roles('coordinator', 'teacher', 'admin')
  @Get('materias')
  async listSubjects() {
    const { subjects } = await this.listSubjectsUseCase.execute();
    return { subjects };
  }

  @Get('ciclos')
  async getTerms() {
    return this.manageTermsUseCase.findAll();
  }

  @Get('modalidades')
  async getModalities() {
    return this.manageModalitiesUseCase.findAll();
  }

  @Get('jornadas')
  async getJornadas() {
    return this.manageJornadasUseCase.findAll();
  }

  @Get('horarios/:teacherSubjectId')
  async getSchedules(@Param('teacherSubjectId') teacherSubjectId: string) {
    return this.manageSchedulesUseCase.getSchedules(teacherSubjectId);
  }

  @Post('horarios')
  async saveSchedules(
    @Body() body: { teacherSubjectId: string; schedules: any[] }
  ) {
    await this.manageSchedulesUseCase.saveSchedules(body.teacherSubjectId, body.schedules);
    return { success: true };
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
      teacherId: req.user.id,
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

  @Get('dashboard')
  async getDashboard(@ReqDecorator() req: AuthenticatedRequest) {
    return this.getCoordinatorDashboardUseCase.execute(req.user.id);
  }

  @Get('carrera/:id')
  async getCareerDetail(@Param('id') id: string) {
    return this.getCareerDetailUseCase.execute(id);
  }

  @Post('register-teacher')
  async registerTeacher(@Body() dto: RegisterTeacherDto) {
    const { user } = await this.registerTeacherUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      birthDate: dto.birthDate,
      phone: dto.phone,
    });
    return { message: 'Docente creado exitosamente', user };
  }
}
