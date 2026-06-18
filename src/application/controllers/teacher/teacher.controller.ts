import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request as ReqDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { EnrollStudentSubjectUseCase } from '@domain/services/teacher/enroll-student-subject.use-case';
import { CreateAssignmentUseCase } from '@domain/services/teacher/create-assignment.use-case';
import { GradeSubmissionUseCase } from '@domain/services/teacher/grade-submission.use-case';
import { EnrollStudentSubjectDto } from '../../dto/teacher/enroll-student-subject.dto';
import { CreateAssignmentDto } from '../../dto/teacher/create-assignment.dto';
import { GradeSubmissionDto } from '../../dto/teacher/grade-submission.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('teacher')
export class TeacherController {
  constructor(
    private readonly enrollStudentSubjectUseCase: EnrollStudentSubjectUseCase,
    private readonly createAssignmentUseCase: CreateAssignmentUseCase,
    private readonly gradeSubmissionUseCase: GradeSubmissionUseCase,
  ) {}

  @Post('inscribir')
  async enrollStudent(
    @Body() dto: EnrollStudentSubjectDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    const { relation } = await this.enrollStudentSubjectUseCase.execute({
      studentId: dto.studentId,
      subjectId: dto.subjectId,
      teacherId: req.user.id,
    });
    return {
      message: 'Estudiante inscrito en la materia exitosamente',
      relation,
    };
  }

  @Post('tareas')
  async createAssignment(
    @Body() dto: CreateAssignmentDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    const { assignment } = await this.createAssignmentUseCase.execute({
      title: dto.title,
      description: dto.description,
      subjectId: dto.subjectId,
      teacherId: req.user.id,
      dueDate: new Date(dto.dueDate),
      maxScore: dto.maxScore,
    });
    return { message: 'Tarea creada exitosamente', assignment };
  }

  @Post('calificar')
  async gradeSubmission(
    @Body() body: { submissionId: string } & GradeSubmissionDto,
  ) {
    const { submission } = await this.gradeSubmissionUseCase.execute({
      submissionId: body.submissionId,
      grade: body.grade,
      feedback: body.feedback,
    });
    return {
      message: 'Entrega calificada exitosamente',
      submission: {
        id: submission.id,
        grade: submission.grade,
        feedback: submission.feedback,
      },
    };
  }
}
