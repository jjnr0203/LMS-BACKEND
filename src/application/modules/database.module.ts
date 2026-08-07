import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from '@infrastructure/database/entities/users/user.orm-entity';
import { RoleOrmEntity } from '@infrastructure/database/entities/users/role.orm-entity';
import { RefreshTokenOrmEntity } from '@infrastructure/database/entities/auth/refresh-token.orm-entity';
import { TeacherOrmEntity } from '@infrastructure/database/entities/users/teacher.orm-entity';
import { StudentOrmEntity } from '@infrastructure/database/entities/users/student.orm-entity';
import { TuitionOrmEntity } from '@infrastructure/database/entities/academic/tuition.orm-entity';
import { SubjectOrmEntity } from '@infrastructure/database/entities/academic/subject.orm-entity';
import { EnrollmentOrmEntity } from '@infrastructure/database/entities/academic/enrollment.orm-entity';
import { AssignmentOrmEntity } from '@infrastructure/database/entities/academic/assignment.orm-entity';
import { SubmissionOrmEntity } from '@infrastructure/database/entities/academic/submission.orm-entity';
import { StudentSubjectOrmEntity } from '@infrastructure/database/entities/academic/student-subject.orm-entity';
import { TeacherSubjectOrmEntity } from '@infrastructure/database/entities/academic/teacher-subject.orm-entity';
import { ScheduleOrmEntity } from '@infrastructure/database/entities/academic/schedule.orm-entity';
import { AcademicTermOrmEntity } from '@infrastructure/database/entities/academic/academic-term.orm-entity';
import { ModalityOrmEntity } from '@infrastructure/database/entities/academic/modality.orm-entity';
import { CareerOrmEntity } from '@infrastructure/database/entities/academic/career.orm-entity';
import { CareerSubjectOrmEntity } from '@infrastructure/database/entities/academic/career-subject.orm-entity';
import { SemesterColorOrmEntity } from '@infrastructure/database/entities/academic/semester-color.orm-entity';
import { CoordinatorSubjectColorOrmEntity } from '@infrastructure/database/entities/academic/coordinator-subject-color.orm-entity';
import { CurriculumOrmEntity } from '@infrastructure/database/entities/academic/curriculum.orm-entity';
import { FacultyOrmEntity } from '@infrastructure/database/entities/academic/faculty.orm-entity';
import { PermissionOrmEntity } from '@infrastructure/database/entities/academic/permission.orm-entity';
import { RolePermissionOrmEntity } from '@infrastructure/database/entities/academic/role-permission.orm-entity';
import { JornadaOrmEntity } from '@infrastructure/database/entities/academic/jornada.orm-entity';
import { InscriptionOrmEntity } from '@infrastructure/database/entities/secretary/inscription.orm-entity';
import { InstitutionConfigOrmEntity } from '@infrastructure/database/entities/institution/institution-config.orm-entity';
import { EnrollmentDetailOrmEntity } from '@infrastructure/database/entities/secretary/enrollment-detail.orm-entity';
import { EnrollmentSubjectOrmEntity } from '@infrastructure/database/entities/secretary/enrollment-subject.orm-entity';
import { AcademicRecordOrmEntity } from '@infrastructure/database/entities/secretary/academic-record.orm-entity';
import { CertificateOrmEntity } from '@infrastructure/database/entities/secretary/certificate.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '12345'),
        database: configService.get<string>('DB_DATABASE', 'lms_db'),
        ssl:
          configService.get<string>('DB_SSL') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        entities: [
          UserOrmEntity,
          TeacherOrmEntity,
          StudentOrmEntity,
          RoleOrmEntity,
          RefreshTokenOrmEntity,
          TuitionOrmEntity,
          SubjectOrmEntity,
          EnrollmentOrmEntity,
          AssignmentOrmEntity,
          SubmissionOrmEntity,
          StudentSubjectOrmEntity,
          TeacherSubjectOrmEntity,
          ScheduleOrmEntity,
          AcademicTermOrmEntity,
          ModalityOrmEntity,
          CareerOrmEntity,
          CareerSubjectOrmEntity,
          SemesterColorOrmEntity,
          CoordinatorSubjectColorOrmEntity,
          CurriculumOrmEntity,
          FacultyOrmEntity,
          PermissionOrmEntity,
          RolePermissionOrmEntity,
          JornadaOrmEntity,
          InscriptionOrmEntity,
          EnrollmentDetailOrmEntity,
          EnrollmentSubjectOrmEntity,
          AcademicRecordOrmEntity,
          CertificateOrmEntity,
          InstitutionConfigOrmEntity,
        ],
        synchronize: false,
        extra: {
          max: 25,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UserOrmEntity,
      TeacherOrmEntity,
      StudentOrmEntity,
      RoleOrmEntity,
      RefreshTokenOrmEntity,
      TuitionOrmEntity,
      SubjectOrmEntity,
      EnrollmentOrmEntity,
      AssignmentOrmEntity,
      SubmissionOrmEntity,
      StudentSubjectOrmEntity,
      TeacherSubjectOrmEntity,
      ScheduleOrmEntity,
      AcademicTermOrmEntity,
      ModalityOrmEntity,
      CareerOrmEntity,
      CareerSubjectOrmEntity,
      SemesterColorOrmEntity,
      CoordinatorSubjectColorOrmEntity,
      CurriculumOrmEntity,
      FacultyOrmEntity,
      PermissionOrmEntity,
      RolePermissionOrmEntity,
      JornadaOrmEntity,
      InscriptionOrmEntity,
      EnrollmentDetailOrmEntity,
      EnrollmentSubjectOrmEntity,
      AcademicRecordOrmEntity,
      CertificateOrmEntity,
      InstitutionConfigOrmEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
