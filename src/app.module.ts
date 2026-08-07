import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { TeachersModule } from './application/modules/teachers.module';
import { StudentsModule } from './application/modules/students.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/modules/auth.module';
import { UsersModule } from './application/modules/users.module';
import { AdminModule } from './application/modules/admin.module';
import { CoordinatorModule } from './application/modules/coordinator.module';
import { TreasuryModule } from './application/modules/treasury.module';
import { TeacherModule } from './application/modules/teacher.module';
import { SecretaryModule } from './application/modules/secretary.module';
import { DatabaseModule } from './application/modules/database.module';
import { HumanResourcesModule } from './application/modules/human-resources.module';
import { InstitutionModule } from './application/modules/institution.module';

@Module({
  imports: [
    TeachersModule,
    StudentsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        defaults: {
          from: `"Soporte Académico SGA" <soporteacademico.sga@gmail.com>`,
        },
        template: {
          dir: process.cwd() + '/src/infrastructure/templates/email',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    AdminModule,
    CoordinatorModule,
    TreasuryModule,
    TeacherModule,
    SecretaryModule,
    HumanResourcesModule,
    InstitutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
