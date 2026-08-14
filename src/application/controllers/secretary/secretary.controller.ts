import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { CreateInscriptionUseCase } from '@domain/services/secretary/create-inscription.use-case';
import { CreateEnrollmentUseCase } from '@domain/services/secretary/create-enrollment.use-case';
import { GenerateCertificateUseCase } from '@domain/services/secretary/generate-certificate.use-case';
import { GetSecretaryDashboardUseCase } from '@domain/services/secretary/get-secretary-dashboard.use-case';
import { InscriptionRepositoryPort } from '@domain/ports/outbound/secretary/inscription-repository.port';
import { EnrollmentDetailRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-detail-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { CAREER_REPOSITORY } from '@domain/ports/outbound/academic/career-repository.port';
import { ACADEMIC_TERM_REPOSITORY } from '@domain/ports/outbound/academic/academic-term-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { CAREER_SUBJECT_REPOSITORY } from '@domain/ports/outbound/academic/career-subject-repository.port';
import { Inject } from '@nestjs/common';
import { CreateInscriptionDto } from '../../dto/secretary/create-inscription.dto';
import { CreateEnrollmentDto } from '../../dto/secretary/create-enrollment.dto';
import { GenerateCertificateDto } from '../../dto/secretary/generate-certificate.dto';

@Controller('secretary')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('secretary')
export class SecretaryController {
  constructor(
    private readonly createInscriptionUseCase: CreateInscriptionUseCase,
    private readonly createEnrollmentUseCase: CreateEnrollmentUseCase,
    private readonly generateCertificateUseCase: GenerateCertificateUseCase,
    private readonly getDashboardUseCase: GetSecretaryDashboardUseCase,
    private readonly inscriptionRepo: InscriptionRepositoryPort,
    private readonly enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
    private readonly studentRepo: StudentRepositoryPort,
    @Inject(CAREER_REPOSITORY) private readonly careerRepo: any,
    @Inject(ACADEMIC_TERM_REPOSITORY) private readonly termRepo: any,
    private readonly subjectRepo: SubjectRepositoryPort,
    @Inject(CAREER_SUBJECT_REPOSITORY) private readonly careerSubjectRepo: any,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.getDashboardUseCase.execute();
  }

  @Post('inscripciones')
  async createInscription(@Body() dto: CreateInscriptionDto) {
    const { inscription } = await this.createInscriptionUseCase.execute({
      studentId: dto.studentId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      careerId: dto.careerId,
      notes: dto.notes,
    });
    return { message: 'Inscripción creada exitosamente', inscription };
  }

  @Get('inscripciones')
  async listInscriptions() {
    const inscriptions =
      await this.createInscriptionUseCase[
        'inscriptionRepo'
      ].findAllWithDetails();
    return { inscriptions };
  }

  @Get('students')
  async listStudents(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const { data, total } = await this.studentRepo.findPaginated(
      pageNum,
      limitNum,
      search,
    );

    const inscriptions = await this.inscriptionRepo.findAllWithDetails();
    const latestByStudent = new Map<string, any>();
    for (const ins of inscriptions) {
      if (!latestByStudent.has(ins.studentId))
        latestByStudent.set(ins.studentId, ins);
    }

    const enrollments = await this.enrollmentDetailRepo.findAll();
    const matriculated = new Set(enrollments.map((e) => e.studentId));

    return {
      data: data.map((s: any) => {
        const ins = latestByStudent.get(s.id);
        return {
          id: s.id,
          firstName: s.firstName,
          lastName: s.lastName,
          email: s.email,
          isActive: s.isActive,
          careerId: ins?.careerId ?? null,
          careerName: ins?.careerName ?? null,
          status: matriculated.has(s.id) ? 'matriculado' : (ins?.status ?? null),
        };
      }),
      total,
      page: pageNum,
      limit: limitNum,
    };
  }

  @Post('matricula')
  async createEnrollment(@Body() dto: CreateEnrollmentDto) {
    const { enrollment } = await this.createEnrollmentUseCase.execute({
      studentId: dto.studentId,
      academicTermId: dto.academicTermId,
      careerId: dto.careerId,
      level: dto.level,
      subjectIds: dto.subjectIds ?? [],
    });
    return { message: 'Matrícula generada exitosamente', enrollment };
  }

  @Post('certificados')
  async generateCertificate(@Body() dto: GenerateCertificateDto) {
    const { certificate } = await this.generateCertificateUseCase.execute({
      studentId: dto.studentId,
      type: dto.type ?? 'matricula',
    });
    return { message: 'Certificado generado exitosamente', certificate };
  }

  @Get('certificados/:studentId')
  async listCertificates(@Param('studentId') studentId: string) {
    const certificates =
      await this.generateCertificateUseCase['certificateRepo'].findByStudentId(
        studentId,
      );
    return { certificates };
  }

  @Get('careers')
  async listCareers() {
    return this.careerRepo.findAll();
  }

  @Get('terms')
  async listTerms() {
    return this.termRepo.findAll();
  }

  @Get('subjects')
  async listSubjects() {
    return this.subjectRepo.findAll();
  }

  @Get('subjects-by-career')
  async listSubjectsByCareer(
    @Query('careerId') careerId: string,
    @Query('semester') semester?: string,
  ) {
    if (semester) {
      return this.careerSubjectRepo.findSubjectsByCareerAndSemester(
        careerId,
        Number(semester),
      );
    }
    const all = await this.careerSubjectRepo.findByCareer(careerId);
    return all.map((cs: any) => ({
      id: cs.subjectId,
      semester: cs.semester,
    }));
  }

  @Get('semesters-by-career')
  async listSemestersByCareer(@Query('careerId') careerId: string) {
    const semesters =
      await this.careerSubjectRepo.findSemestersByCareer(careerId);
    return semesters.map((s: number) => ({
      value: s,
      label: `${s}er Semestre`,
    }));
  }
}
