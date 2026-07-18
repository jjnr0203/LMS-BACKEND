import { v4 as uuid } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { CreateEnrollmentUseCasePort, CreateEnrollmentCommand } from '@domain/ports/inbound/secretary/create-enrollment.use-case.port';
import { EnrollmentDetailRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-detail-repository.port';
import { EnrollmentSubjectRepositoryPort } from '@domain/ports/outbound/secretary/enrollment-subject-repository.port';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { EnrollmentDetailEntity } from '@domain/entities/secretary/enrollment-detail.entity';
import { EnrollmentSubjectEntity } from '@domain/entities/secretary/enrollment-subject.entity';

export class CreateEnrollmentUseCase implements CreateEnrollmentUseCasePort {
  constructor(
    private readonly enrollmentDetailRepo: EnrollmentDetailRepositoryPort,
    private readonly enrollmentSubjectRepo: EnrollmentSubjectRepositoryPort,
    private readonly userRepo: UserRepositoryPort,
  ) {}

  async execute(command: CreateEnrollmentCommand): Promise<{ enrollment: EnrollmentDetailEntity }> {
    const student = await this.userRepo.findById(command.studentId);
    if (!student) {
      throw new BadRequestException('El estudiante no existe');
    }

    const existing = await this.enrollmentDetailRepo.findByStudentAndTerm(
      command.studentId,
      command.academicTermId,
    );
    if (existing) {
      throw new BadRequestException('El estudiante ya está matriculado en este período');
    }

    const enrollmentId = uuid();
    const enrollment = new EnrollmentDetailEntity(
      enrollmentId,
      command.studentId,
      command.academicTermId,
      command.careerId,
      command.level,
      'active',
    );

    const saved = await this.enrollmentDetailRepo.save(enrollment);

    if (command.subjectIds && command.subjectIds.length > 0) {
      const subjects = command.subjectIds.map(
        subjectId =>
          new EnrollmentSubjectEntity(
            uuid(),
            enrollmentId,
            subjectId,
            'enrolled',
          ),
      );
      await this.enrollmentSubjectRepo.saveMany(subjects);
    }

    return { enrollment: saved };
  }
}
