import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from '@infrastructure/database/entities/users/user.orm-entity';
import { RoleOrmEntity } from '@infrastructure/database/entities/users/role.orm-entity';
import { RefreshTokenOrmEntity } from '@infrastructure/database/entities/auth/refresh-token.orm-entity';
import { TuitionOrmEntity } from '@infrastructure/database/entities/academic/tuition.orm-entity';
import { SubjectOrmEntity } from '@infrastructure/database/entities/academic/subject.orm-entity';
import { EnrollmentOrmEntity } from '@infrastructure/database/entities/academic/enrollment.orm-entity';
import { AssignmentOrmEntity } from '@infrastructure/database/entities/academic/assignment.orm-entity';
import { SubmissionOrmEntity } from '@infrastructure/database/entities/academic/submission.orm-entity';
import { StudentSubjectOrmEntity } from '@infrastructure/database/entities/academic/student-subject.orm-entity';
import { TeacherSubjectOrmEntity } from '@infrastructure/database/entities/academic/teacher-subject.orm-entity';
import { AcademicTermOrmEntity } from '@infrastructure/database/entities/academic/academic-term.orm-entity';
import { ModalityOrmEntity } from '@infrastructure/database/entities/academic/modality.orm-entity';
import { CareerOrmEntity } from '@infrastructure/database/entities/academic/career.orm-entity';
import { CareerSubjectOrmEntity } from '@infrastructure/database/entities/academic/career-subject.orm-entity';
import { SemesterColorOrmEntity } from '@infrastructure/database/entities/academic/semester-color.orm-entity';
import { CurriculumOrmEntity } from '@infrastructure/database/entities/academic/curriculum.orm-entity';

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
          RoleOrmEntity,
          RefreshTokenOrmEntity,
          TuitionOrmEntity,
          SubjectOrmEntity,
          EnrollmentOrmEntity,
          AssignmentOrmEntity,
          SubmissionOrmEntity,
          StudentSubjectOrmEntity,
          TeacherSubjectOrmEntity,
          AcademicTermOrmEntity,
          ModalityOrmEntity,
          CareerOrmEntity,
          CareerSubjectOrmEntity,
          SemesterColorOrmEntity,
          CurriculumOrmEntity,
        ],
        synchronize: true,
        extra: {
          max: 25,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      RefreshTokenOrmEntity,
      TuitionOrmEntity,
      SubjectOrmEntity,
      EnrollmentOrmEntity,
      AssignmentOrmEntity,
      SubmissionOrmEntity,
      StudentSubjectOrmEntity,
      TeacherSubjectOrmEntity,
      AcademicTermOrmEntity,
      ModalityOrmEntity,
      CareerOrmEntity,
      CareerSubjectOrmEntity,
      SemesterColorOrmEntity,
      CurriculumOrmEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
