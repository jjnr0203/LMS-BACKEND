import { EnrollStudentUseCasePort } from '../../ports/inbound/coordinator/enroll-student.use-case.port';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import { EnrollmentRepositoryPort } from '../../ports/outbound/academic/enrollment-repository.port';
import { EnrollmentEntity } from '../../entities/academic/enrollment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';

export class EnrollStudentUseCase implements EnrollStudentUseCasePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly enrollmentRepository: EnrollmentRepositoryPort,
  ) {}

  async execute(studentId: string): Promise<{ enrollment: EnrollmentEntity }> {
    const user = await this.userRepository.findById(studentId);
    if (!user) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    const existingEnrollment =
      await this.enrollmentRepository.findByStudentId(studentId);
    if (existingEnrollment) {
      throw new BadRequestException(
        'El estudiante ya está matriculado en la carrera',
      );
    }

    const enrollment = new EnrollmentEntity(
      crypto.randomUUID(),
      studentId,
      new Date(),
    );

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);
    return { enrollment: savedEnrollment };
  }
}
