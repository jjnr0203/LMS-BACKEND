import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { StudentEntity } from '../../infrastructure/database/entities/student.entity';
import { TeacherEntity } from '../../infrastructure/database/entities/teacher.entity';
import { TreasuryStaffEntity } from '../../infrastructure/database/entities/treasury-staff.entity';
import { AdministrativeStaffEntity } from '../../infrastructure/database/entities/administrative-staff.entity';
import { CourseCategoryEntity } from '../../infrastructure/database/entities/course-category.entity';
import { CourseEntity } from '../../infrastructure/database/entities/course.entity';
import { CourseModuleEntity } from '../../infrastructure/database/entities/course-module.entity';
import { LessonEntity } from '../../infrastructure/database/entities/lesson.entity';
import { EnrollmentEntity } from '../../infrastructure/database/entities/enrollment.entity';
import { AssignmentEntity } from '../../infrastructure/database/entities/assignment.entity';
import { AssignmentSubmissionEntity } from '../../infrastructure/database/entities/assignment-submission.entity';
import { ExamEntity } from '../../infrastructure/database/entities/exam.entity';
import { ExamQuestionEntity } from '../../infrastructure/database/entities/exam-question.entity';
import { ExamAttemptEntity } from '../../infrastructure/database/entities/exam-attempt.entity';
import { ExamAnswerEntity } from '../../infrastructure/database/entities/exam-answer.entity';
import { AttendanceEntity } from '../../infrastructure/database/entities/attendance.entity';
import { PaymentEntity } from '../../infrastructure/database/entities/payment.entity';
import { AuditLogEntity } from '../../infrastructure/database/entities/audit-log.entity';

const entities = [
  UserEntity,
  StudentEntity,
  TeacherEntity,
  TreasuryStaffEntity,
  AdministrativeStaffEntity,
  CourseCategoryEntity,
  CourseEntity,
  CourseModuleEntity,
  LessonEntity,
  EnrollmentEntity,
  AssignmentEntity,
  AssignmentSubmissionEntity,
  ExamEntity,
  ExamQuestionEntity,
  ExamAttemptEntity,
  ExamAnswerEntity,
  AttendanceEntity,
  PaymentEntity,
  AuditLogEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_DATABASE', 'lms_db'),
        entities,
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
