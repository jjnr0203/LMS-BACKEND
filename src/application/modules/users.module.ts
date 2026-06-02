import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users/users.controller';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth.module';
import { GetPaginatedUsersUseCase } from '../../domain/services/users/get-paginated-users.use-case';
import { GetUserByIdUseCase } from '../../domain/services/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '../../domain/services/users/update-user.use-case';
import { UploadAvatarUseCase } from '../../domain/services/users/upload-avatar.use-case';
import { CloudinaryAdapter } from '../../infrastructure/adapters/storage/cloudinary.adapter';
import { ImageUploadPort } from '../../domain/ports/outbound/storage/image-upload.port';
import { ConfigModule } from '@nestjs/config';
import { UpdatePasswordUseCase } from '../../domain/services/users/update-password.use-case';
import { SoftDeleteUserUseCase } from '../../domain/services/users/soft-delete-user.use-case';
import { UserRepositoryPort } from '../../domain/ports/outbound/users/user-repository.port';
import { PasswordHasherPort } from '../../domain/ports/outbound/auth/password-hasher.port';

@Module({
  imports: [DatabaseModule, AuthModule, ConfigModule],
  controllers: [UsersController],
  providers: [
    {
      provide: ImageUploadPort,
      useClass: CloudinaryAdapter,
    },
    {
      provide: GetPaginatedUsersUseCase,
      useFactory: (userRepo: UserRepositoryPort) => new GetPaginatedUsersUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepo: UserRepositoryPort) => new GetUserByIdUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepo: UserRepositoryPort) => new UpdateUserUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (userRepo: UserRepositoryPort, hasher: PasswordHasherPort) => new UpdatePasswordUseCase(userRepo, hasher),
      inject: [UserRepositoryPort, PasswordHasherPort],
    },
    {
      provide: SoftDeleteUserUseCase,
      useFactory: (userRepo: UserRepositoryPort) => new SoftDeleteUserUseCase(userRepo),
      inject: [UserRepositoryPort],
    },
    {
      provide: UploadAvatarUseCase,
      useFactory: (userRepo: UserRepositoryPort, uploadPort: ImageUploadPort) => 
        new UploadAvatarUseCase(userRepo, uploadPort),
      inject: [UserRepositoryPort, ImageUploadPort],
    },
  ],
})
export class UsersModule {}
