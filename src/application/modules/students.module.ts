import { Module } from '@nestjs/common';
import { StudentsController } from '../controllers/users/students.controller';
import { StudentService } from '@domain/services/users/student.service';
import { RepositoryProvidersModule } from './repository-providers.module';

@Module({
  imports: [RepositoryProvidersModule],
  controllers: [StudentsController],
  providers: [StudentService],
})
export class StudentsModule {}
