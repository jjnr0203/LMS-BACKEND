import { Module } from '@nestjs/common';
import { AdminController } from '../controllers/admin/admin.controller';
import { CreateUserUseCase } from '@domain/services/admin/create-user.use-case';
import { GetDashboardStatsUseCase } from '@domain/services/admin/get-dashboard-stats.use-case';
import { GetCareerBreakdownUseCase } from '@domain/services/admin/academic/get-career-breakdown.use-case';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { TeacherRepositoryPort } from '@domain/ports/outbound/users/teacher-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { MailerService } from '@nestjs-modules/mailer';
import { RepositoryProvidersModule } from './repository-providers.module';
import { AdminAcademicController } from '../controllers/admin/admin-academic.controller';
import { ManageAcademicTermsUseCase } from '@domain/services/admin/academic/manage-academic-terms.use-case';
import { ManageModalitiesUseCase } from '@domain/services/admin/academic/manage-modalities.use-case';
import { ManageCareersUseCase } from '@domain/services/admin/academic/manage-careers.use-case';
import { ManageSubjectsUseCase } from '@domain/services/admin/academic/manage-subjects.use-case';
import { BulkCreateSubjectsUseCase } from '@domain/services/admin/academic/bulk-create-subjects.use-case';
import { UpdatePrerequisitesUseCase } from '@domain/services/admin/academic/update-prerequisites.use-case';
import { UpdateSuccessorsUseCase } from '@domain/services/admin/academic/update-successors.use-case';
import { ManageSemesterColorsUseCase } from '@domain/services/admin/manage-semester-colors.use-case';
import {
  AcademicTermRepositoryPort,
  ACADEMIC_TERM_REPOSITORY,
} from '@domain/ports/outbound/academic/academic-term-repository.port';
import {
  ModalityRepositoryPort,
  MODALITY_REPOSITORY,
} from '@domain/ports/outbound/academic/modality-repository.port';
import {
  JornadaRepositoryPort,
  JORNADA_REPOSITORY,
} from '@domain/ports/outbound/academic/jornada-repository.port';
import { ManageJornadasUseCase } from '@domain/services/admin/academic/manage-jornadas.use-case';
import {
  CareerRepositoryPort,
  CAREER_REPOSITORY,
} from '@domain/ports/outbound/academic/career-repository.port';
import {
  CareerSubjectRepositoryPort,
  CAREER_SUBJECT_REPOSITORY,
} from '@domain/ports/outbound/academic/career-subject-repository.port';
import { ManageCurriculumsUseCase } from '@domain/services/admin/academic/manage-curriculums.use-case';
import { ManageFacultiesUseCase } from '@domain/services/admin/academic/manage-faculties.use-case';
import {
  CurriculumRepositoryPort,
  CURRICULUM_REPOSITORY,
} from '@domain/ports/outbound/academic/curriculum-repository.port';
import {
  FacultyRepositoryPort,
  FACULTY_REPOSITORY,
} from '@domain/ports/outbound/academic/faculty-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { TeacherSubjectRepositoryPort } from '@domain/ports/outbound/academic/teacher-subject-repository.port';
import { AuditLogsController } from '../controllers/admin/audit-logs.controller';
import { BackupController } from '../controllers/admin/backup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogOrmEntity } from '@infrastructure/database/entities/audit/audit-log.orm-entity';

@Module({
  imports: [
    RepositoryProvidersModule,
    TypeOrmModule.forFeature([AuditLogOrmEntity]),
  ],
  controllers: [
    AdminController,
    AdminAcademicController,
    AuditLogsController,
    BackupController,
  ],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
        mailerService: MailerService,
      ) => new CreateUserUseCase(userRepo, roleRepo, hasher, mailerService),
      inject: [
        UserRepositoryPort,
        RoleRepositoryPort,
        PasswordHasherPort,
        MailerService,
      ],
    },
    {
      provide: GetDashboardStatsUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        careerRepo: CareerRepositoryPort,
        modalityRepo: ModalityRepositoryPort,
        curriculumRepo: CurriculumRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
        facultyRepo: FacultyRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
        studentRepo: StudentRepositoryPort,
      ) =>
        new GetDashboardStatsUseCase(
          userRepo,
          careerRepo,
          modalityRepo,
          curriculumRepo,
          subjectRepo,
          facultyRepo,
          teacherRepo,
          studentRepo,
        ),
      inject: [
        UserRepositoryPort,
        CAREER_REPOSITORY,
        MODALITY_REPOSITORY,
        CURRICULUM_REPOSITORY,
        SubjectRepositoryPort,
        FACULTY_REPOSITORY,
        TeacherRepositoryPort,
        StudentRepositoryPort,
      ],
    },
    {
      provide: ManageAcademicTermsUseCase,
      useFactory: (repo: AcademicTermRepositoryPort) =>
        new ManageAcademicTermsUseCase(repo),
      inject: [ACADEMIC_TERM_REPOSITORY],
    },
    {
      provide: ManageModalitiesUseCase,
      useFactory: (repo: ModalityRepositoryPort) =>
        new ManageModalitiesUseCase(repo),
      inject: [MODALITY_REPOSITORY],
    },
    {
      provide: ManageJornadasUseCase,
      useFactory: (repo: JornadaRepositoryPort) =>
        new ManageJornadasUseCase(repo),
      inject: [JORNADA_REPOSITORY],
    },
    {
      provide: ManageCareersUseCase,
      useFactory: (
        careerRepo: CareerRepositoryPort,
        careerSubjRepo: CareerSubjectRepositoryPort,
        curriculumRepo: CurriculumRepositoryPort,
      ) => new ManageCareersUseCase(careerRepo, careerSubjRepo, curriculumRepo),
      inject: [
        CAREER_REPOSITORY,
        CAREER_SUBJECT_REPOSITORY,
        CURRICULUM_REPOSITORY,
      ],
    },
    {
      provide: ManageSubjectsUseCase,
      useFactory: (
        repo: SubjectRepositoryPort,
        careerSubjRepo: CareerSubjectRepositoryPort,
      ) => new ManageSubjectsUseCase(repo, careerSubjRepo),
      inject: [SubjectRepositoryPort, CAREER_SUBJECT_REPOSITORY],
    },
    {
      provide: UpdateSuccessorsUseCase,
      useFactory: (careerSubjRepo: CareerSubjectRepositoryPort) =>
        new UpdateSuccessorsUseCase(careerSubjRepo),
      inject: [CAREER_SUBJECT_REPOSITORY],
    },
    {
      provide: BulkCreateSubjectsUseCase,
      useFactory: (
        subjRepo: SubjectRepositoryPort,
        careerSubjRepo: CareerSubjectRepositoryPort,
      ) => new BulkCreateSubjectsUseCase(subjRepo, careerSubjRepo),
      inject: [SubjectRepositoryPort, CAREER_SUBJECT_REPOSITORY],
    },
    {
      provide: UpdatePrerequisitesUseCase,
      useFactory: (careerSubjRepo: CareerSubjectRepositoryPort) =>
        new UpdatePrerequisitesUseCase(careerSubjRepo),
      inject: [CAREER_SUBJECT_REPOSITORY],
    },
    {
      provide: ManageSemesterColorsUseCase,
      useFactory: (repo: any) => new ManageSemesterColorsUseCase(repo),
      inject: ['SEMESTER_COLOR_REPOSITORY'],
    },
    {
      provide: ManageCurriculumsUseCase,
      useFactory: (
        curriculumRepo: CurriculumRepositoryPort,
        careerSubjRepo: CareerSubjectRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
      ) =>
        new ManageCurriculumsUseCase(
          curriculumRepo,
          careerSubjRepo,
          subjectRepo,
        ),
      inject: [
        CURRICULUM_REPOSITORY,
        CAREER_SUBJECT_REPOSITORY,
        SubjectRepositoryPort,
      ],
    },
    {
      provide: ManageFacultiesUseCase,
      useFactory: (repo: FacultyRepositoryPort) =>
        new ManageFacultiesUseCase(repo),
      inject: [FACULTY_REPOSITORY],
    },
    {
      provide: GetCareerBreakdownUseCase,
      useFactory: (
        careerRepo: CareerRepositoryPort,
        curriculumRepo: CurriculumRepositoryPort,
        careerSubjRepo: CareerSubjectRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
        modalityRepo: ModalityRepositoryPort,
        userRepo: UserRepositoryPort,
        teacherSubjRepo: TeacherSubjectRepositoryPort,
        jornadaRepo: JornadaRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
      ) =>
        new GetCareerBreakdownUseCase(
          careerRepo,
          curriculumRepo,
          careerSubjRepo,
          subjectRepo,
          modalityRepo,
          userRepo,
          teacherSubjRepo,
          jornadaRepo,
          teacherRepo,
        ),
      inject: [
        CAREER_REPOSITORY,
        CURRICULUM_REPOSITORY,
        CAREER_SUBJECT_REPOSITORY,
        SubjectRepositoryPort,
        MODALITY_REPOSITORY,
        UserRepositoryPort,
        TeacherSubjectRepositoryPort,
        JORNADA_REPOSITORY,
        TeacherRepositoryPort,
      ],
    },
  ],
})
export class AdminModule {}
