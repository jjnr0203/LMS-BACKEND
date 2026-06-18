import { Module } from '@nestjs/common';
import { TeacherController } from '../controllers/teacher/teacher.controller';
import { EnrollStudentSubjectUseCase } from '@domain/services/teacher/enroll-student-subject.use-case';
import { CreateAssignmentUseCase } from '@domain/services/teacher/create-assignment.use-case';
import { GradeSubmissionUseCase } from '@domain/services/teacher/grade-submission.use-case';
import { StudentSubjectRepositoryPort } from '@domain/ports/outbound/academic/student-subject-repository.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { AssignmentRepositoryPort } from '@domain/ports/outbound/academic/assignment-repository.port';
import { SubmissionRepositoryPort } from '@domain/ports/outbound/academic/submission-repository.port';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [TeacherController],
  providers: [
    {
      provide: EnrollStudentSubjectUseCase,
      useFactory: (
        ssRepo: StudentSubjectRepositoryPort,
        userRepo: UserRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
      ) => new EnrollStudentSubjectUseCase(ssRepo, userRepo, subjectRepo),
      inject: [
        StudentSubjectRepositoryPort,
        UserRepositoryPort,
        SubjectRepositoryPort,
      ],
    },
    {
      provide: CreateAssignmentUseCase,
      useFactory: (
        assignmentRepo: AssignmentRepositoryPort,
        subjectRepo: SubjectRepositoryPort,
      ) => new CreateAssignmentUseCase(assignmentRepo, subjectRepo),
      inject: [AssignmentRepositoryPort, SubjectRepositoryPort],
    },
    {
      provide: GradeSubmissionUseCase,
      useFactory: (
        submissionRepo: SubmissionRepositoryPort,
        assignmentRepo: AssignmentRepositoryPort,
      ) => new GradeSubmissionUseCase(submissionRepo, assignmentRepo),
      inject: [SubmissionRepositoryPort, AssignmentRepositoryPort],
    },
  ],
})
export class TeacherModule {}
