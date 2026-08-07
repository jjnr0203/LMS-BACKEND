import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users/users.controller';
import { RepositoryProvidersModule } from './repository-providers.module';
import { ConfigModule } from '@nestjs/config';
import { GetPaginatedUsersUseCase } from '@domain/services/users/get-paginated-users.use-case';
import { GetUserByIdUseCase } from '@domain/services/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@domain/services/users/update-user.use-case';
import { UpdatePasswordUseCase } from '@domain/services/users/update-password.use-case';
import { SoftDeleteUserUseCase } from '@domain/services/users/soft-delete-user.use-case';
import { UploadAvatarUseCase } from '@domain/services/users/upload-avatar.use-case';
import { UploadCvUseCase } from '@domain/services/users/upload-cv.use-case';
import { UploadCertificateUseCase } from '@domain/services/users/upload-certificate.use-case';
import { DeleteCertificateUseCase } from '@domain/services/users/delete-certificate.use-case';
import { CloudinaryAdapter } from '@infrastructure/adapters/storage/cloudinary.adapter';
import { ImageUploadPort } from '@domain/ports/outbound/storage/image-upload.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { TeacherRepositoryPort } from '@domain/ports/outbound/users/teacher-repository.port';
import { StudentRepositoryPort } from '@domain/ports/outbound/users/student-repository.port';
import { PasswordHasherPort } from '@domain/ports/outbound/auth/password-hasher.port';

@Module({
  imports: [RepositoryProvidersModule, ConfigModule],
  controllers: [UsersController],
  providers: [
    {
      provide: ImageUploadPort,
      useClass: CloudinaryAdapter,
    },
    {
      provide: GetPaginatedUsersUseCase,
      useFactory: (userRepo: UserRepositoryPort) =>
        new GetPaginatedUsersUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepo: UserRepositoryPort) =>
        new GetUserByIdUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepo: UserRepositoryPort) =>
        new UpdateUserUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (userRepo: UserRepositoryPort, hasher: PasswordHasherPort) =>
        new UpdatePasswordUseCase(userRepo, hasher),
      inject: [UserRepositoryPort, PasswordHasherPort],
    },
    {
      provide: SoftDeleteUserUseCase,
      useFactory: (userRepo: UserRepositoryPort) =>
        new SoftDeleteUserUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: UploadAvatarUseCase,
      useFactory: (userRepo: UserRepositoryPort, uploadPort: ImageUploadPort) =>
        new UploadAvatarUseCase(userRepo, uploadPort),
      inject: [UserRepositoryPort, ImageUploadPort],
    },
    {
      provide: UploadCvUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
        studentRepo: StudentRepositoryPort,
        uploadPort: ImageUploadPort,
      ) => new UploadCvUseCase(userRepo, teacherRepo, studentRepo, uploadPort),
      inject: [
        UserRepositoryPort,
        TeacherRepositoryPort,
        StudentRepositoryPort,
        ImageUploadPort,
      ],
    },
    {
      provide: UploadCertificateUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
        studentRepo: StudentRepositoryPort,
        uploadPort: ImageUploadPort,
      ) => new UploadCertificateUseCase(userRepo, teacherRepo, studentRepo, uploadPort),
      inject: [
        UserRepositoryPort,
        TeacherRepositoryPort,
        StudentRepositoryPort,
        ImageUploadPort,
      ],
    },
    {
      provide: DeleteCertificateUseCase,
      useFactory: (
        userRepo: UserRepositoryPort,
        teacherRepo: TeacherRepositoryPort,
        studentRepo: StudentRepositoryPort,
      ) => new DeleteCertificateUseCase(userRepo, teacherRepo, studentRepo),
      inject: [
        UserRepositoryPort,
        TeacherRepositoryPort,
        StudentRepositoryPort,
      ],
    },
  ],
})
export class UsersModule {}
