import { Module } from '@nestjs/common';
import { CoordinatorController } from '../controllers/coordinator/coordinator.controller';
import { CreateSubjectUseCase } from '@domain/services/coordinator/create-subject.use-case';
import { EnrollStudentUseCase } from '@domain/services/coordinator/enroll-student.use-case';
import { AssignTeacherUseCase } from '@domain/services/coordinator/assign-teacher.use-case';
import { ListSubjectsUseCase } from '@domain/services/coordinator/list-subjects.use-case';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';
import { TuitionRepositoryPort } from '@domain/ports/outbound/academic/tuition-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { EnrollmentRepositoryPort } from '@domain/ports/outbound/academic/enrollment-repository.port';
import { TeacherSubjectRepositoryPort } from '@domain/ports/outbound/academic/teacher-subject-repository.port';
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
      inject: [SubjectRepositoryPort, UserRepositoryPort, TeacherSubjectRepositoryPort],
    },
  ],
})
export class CoordinatorModule {}
