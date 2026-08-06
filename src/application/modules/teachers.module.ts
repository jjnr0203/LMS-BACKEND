import { Module } from '@nestjs/common';
import { TeachersController } from '../controllers/users/teachers.controller';
import { TeacherService } from '@domain/services/users/teacher.service';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [TeachersController],
  providers: [TeacherService],
})
export class TeachersModule {}