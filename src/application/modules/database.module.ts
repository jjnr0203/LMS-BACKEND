import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from '../../infrastructure/database/entities/users/user.orm-entity';
import { RoleOrmEntity } from '../../infrastructure/database/entities/users/role.orm-entity';
import { RefreshTokenOrmEntity } from '../../infrastructure/database/entities/auth/refresh-token.orm-entity';
import { TuitionOrmEntity } from '../../infrastructure/database/entities/academic/tuition.orm-entity';
import { SubjectOrmEntity } from '../../infrastructure/database/entities/academic/subject.orm-entity';
import { EnrollmentOrmEntity } from '../../infrastructure/database/entities/academic/enrollment.orm-entity';
import { AssignmentOrmEntity } from '../../infrastructure/database/entities/academic/assignment.orm-entity';
import { SubmissionOrmEntity } from '../../infrastructure/database/entities/academic/submission.orm-entity';
import { StudentSubjectOrmEntity } from '../../infrastructure/database/entities/academic/student-subject.orm-entity';

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
        ],
        synchronize: true,
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
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
