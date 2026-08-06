import { Module } from '@nestjs/common';
import { CoordinatorController } from '../controllers/coordinator/coordinator.controller';
import { CreateSubjectUseCase } from '@domain/services/coordinator/create-subject.use-case';
import { EnrollStudentUseCase } from '@domain/services/coordinator/enroll-student.use-case';
import { AssignTeacherUseCase } from '@domain/services/coordinator/assign-teacher.use-case';
import { ListSubjectsUseCase } from '@domain/services/coordinator/list-subjects.use-case';
import { RegisterTeacherUseCase } from '@domain/services/coordinator/register-teacher.use-case';
import { GetCoordinatorDashboardUseCase } from '@domain/services/coordinator/get-coordinator-dashboard.use-case';
import { ManageCoordinatorSubjectColorsUseCase } from '@domain/services/coordinator/manage-coordinator-subject-colors.use-case';
import { COORDINATOR_SUBJECT_COLOR_REPOSITORY, CoordinatorSubjectColorRepositoryPort } from '@domain/ports/outbound/academic/coordinator-subject-color-repository.port';
import { ManageSchedulesUseCase } from '@domain/services/coordinator/manage-schedules.use-case';
import { ScheduleRepositoryPort } from '@domain/ports/outbound/academic/schedule-repository.port';
import { GetCareerDetailUseCase } from '@domain/services/coordinator/get-career-detail.use-case';
import { UnassignTeacherUseCase } from '@domain/services/coordinator/unassign-teacher.use-case';
import { BulkAssignTeacherUseCase } from '@domain/services/coordinator/bulk-assign-teacher.use-case';
import { ManageAcademicTermsUseCase } from '@domain/services/admin/academic/manage-academic-terms.use-case';
import { ManageModalitiesUseCase } from '@domain/services/admin/academic/manage-modalities.use-case';
import { ManageJornadasUseCase } from '@domain/services/admin/academic/manage-jornadas.use-case';
import { RegisterTeacherUseCasePort } from '@domain/ports/inbound/coordinator/register-teacher.use-case.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { TeacherRepositoryPort } from '@domain/ports/outbound/users/teacher-repository.port';
import { EnrollmentRepositoryPort } from '@domain/ports/outbound/academic/enrollment-repository.port';
import { TeacherSubjectRepositoryPort } from '@domain/ports/outbound/academic/teacher-subject-repository.port';
import {
  CareerRepositoryPort,
  CAREER_REPOSITORY,
} from '@domain/ports/outbound/academic/career-repository.port';
import {
  AcademicTermRepositoryPort,
  ACADEMIC_TERM_REPOSITORY,
} from '@domain/ports/outbound/academic/academic-term-repository.port';
import {
  ModalityRepositoryPort,
  MODALITY_REPOSITORY,
} from '@domain/ports/outbound/academic/modality-repository.port';
import {
  CurriculumRepositoryPort,
  CURRICULUM_REPOSITORY,
} from '@domain/ports/outbound/academic/curriculum-repository.port';
import {
  JornadaRepositoryPort,
  JORNADA_REPOSITORY,
} from '@domain/ports/outbound/academic/jornada-repository.port';
import {
  CareerSubjectRepositoryPort,
  CAREER_SUBJECT_REPOSITORY,
} from '@domain/ports/outbound/academic/career-subject-repository.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [CoordinatorController],
  providers: [
    {
      provide: CreateSubjectUseCase,
      useFactory: (subjectRepo: SubjectRepositoryPort) =>
        new CreateSubjectUseCase(subjectRepo),
      inject: [SubjectRepositoryPort],
    },
    {
      provide: ListSubjectsUseCase,
      useFactory: (subjectRepo: SubjectRepositoryPort) =>
        new ListSubjectsUseCase(subjectRepo),
      inject: [SubjectRepositoryPort],
    },
    {
      provide: EnrollStudentUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        enrollmentRepo: EnrollmentRepositoryPort,
      ) => new EnrollStudentUseCase(userRepo, enrollmentRepo),
      inject: [UserRepositoryPort, EnrollmentRepositoryPort],
    },
    {
      provide: AssignTeacherUseCase,
      useFactory: (
        subjectRepo: SubjectRepositoryPort,
        userRepo: UserRepositoryPort,
        teacherSubjectRepo: TeacherSubjectRepositoryPort,
      ) => new AssignTeacherUseCase(subjectRepo, userRepo, teacherSubjectRepo),
      inject: [
        SubjectRepositoryPort,
        UserRepositoryPort,
        TeacherSubjectRepositoryPort,
      ],
    },
    {
      provide: BulkAssignTeacherUseCase,
      useFactory: (
        subjectRepo: SubjectRepositoryPort,
        userRepo: UserRepositoryPort,
        teacherSubjectRepo: TeacherSubjectRepositoryPort,
      ) => new BulkAssignTeacherUseCase(subjectRepo, userRepo, teacherSubjectRepo),
      inject: [
        SubjectRepositoryPort,
        UserRepositoryPort,
        TeacherSubjectRepositoryPort,
      ],
    },
    {
      provide: RegisterTeacherUseCasePort,
      useFactory: (
        userRepo: UserRepositoryPort,
        roleRepo: RoleRepositoryPort,
        hasher: PasswordHasherPort,
      ) => new RegisterTeacherUseCase(userRepo, roleRepo, hasher),
      inject: [UserRepositoryPort, RoleRepositoryPort, PasswordHasherPort],
    },
    {
      provide: GetCoordinatorDashboardUseCase,
      useFactory: (
        careerRepo: CareerRepositoryPort,
        careerSubjectRepo: CareerSubjectRepositoryPort,
        modalityRepo: ModalityRepositoryPort,
      ) =>
        new GetCoordinatorDashboardUseCase(
          careerRepo,
          careerSubjectRepo,
          modalityRepo,
        ),
      inject: [CAREER_REPOSITORY, CAREER_SUBJECT_REPOSITORY, MODALITY_REPOSITORY],
    },
    {
      provide: UnassignTeacherUseCase,
      useFactory: (
        subjectRepo: SubjectRepositoryPort,
        teacherSubjectRepo: TeacherSubjectRepositoryPort,
      ) => new UnassignTeacherUseCase(subjectRepo, teacherSubjectRepo),
      inject: [SubjectRepositoryPort, TeacherSubjectRepositoryPort],
    },
    {
      provide: GetCareerDetailUseCase,
      useFactory: (
        careerRepo: CareerRepositoryPort,
        modalityRepo: ModalityRepositoryPort,
        curriculumRepo: CurriculumRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
        careerSubjectRepo: CareerSubjectRepositoryPort,
        teacherSubjectRepo: TeacherSubjectRepositoryPort,
        userRepo: UserRepositoryPort,
        jornadaRepo: JornadaRepositoryPort,
        scheduleRepo: ScheduleRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
      ) =>
        new GetCareerDetailUseCase(
          careerRepo,
          modalityRepo,
          curriculumRepo,
          subjectRepo,
          careerSubjectRepo,
          teacherSubjectRepo,
          userRepo,
          jornadaRepo,
          scheduleRepo,
          teacherRepo,
        ),
      inject: [
        CAREER_REPOSITORY,
        MODALITY_REPOSITORY,
        CURRICULUM_REPOSITORY,
        SubjectRepositoryPort,
        CAREER_SUBJECT_REPOSITORY,
        TeacherSubjectRepositoryPort,
        UserRepositoryPort,
        JORNADA_REPOSITORY,
        ScheduleRepositoryPort,
        TeacherRepositoryPort,
      ],
    },
    {
      provide: ManageAcademicTermsUseCase,
      useFactory: (termRepo: AcademicTermRepositoryPort) =>
        new ManageAcademicTermsUseCase(termRepo),
      inject: [ACADEMIC_TERM_REPOSITORY],
    },
    {
      provide: ManageModalitiesUseCase,
      useFactory: (modRepo: ModalityRepositoryPort) =>
        new ManageModalitiesUseCase(modRepo),
      inject: [MODALITY_REPOSITORY],
    },
    {
      provide: ManageJornadasUseCase,
      useFactory: (jorRepo: JornadaRepositoryPort) =>
        new ManageJornadasUseCase(jorRepo),
      inject: [JORNADA_REPOSITORY],
    },
    {
      provide: ManageSchedulesUseCase,
      useFactory: (scheduleRepo: ScheduleRepositoryPort) =>
        new ManageSchedulesUseCase(scheduleRepo),
      inject: [ScheduleRepositoryPort],
    },
    {
      provide: ManageCoordinatorSubjectColorsUseCase,
      useFactory: (repo: CoordinatorSubjectColorRepositoryPort) => new ManageCoordinatorSubjectColorsUseCase(repo),
      inject: [COORDINATOR_SUBJECT_COLOR_REPOSITORY],
    },
  ],
})
export class CoordinatorModule {}
