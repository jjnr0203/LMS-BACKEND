import { randomUUID } from 'node:crypto';
import { TuitionRepositoryPort } from '../../ports/outbound/academic/tuition-repository.port';
import { TuitionEntity } from '../../entities/academic/tuition.entity';
import { BadRequestException } from '@nestjs/common';

export class EnrollStudentUseCase {
  constructor(private readonly tuitionRepository: TuitionRepositoryPort) {}

  async execute(studentId: string): Promise<{ tuition: TuitionEntity }> {
    const existing = await this.tuitionRepository.findByStudentId(studentId);

    if (existing) {
      throw new BadRequestException(
        'El estudiante ya tiene una matrícula registrada',
      );
    }

    const tuition = new TuitionEntity(
      randomUUID(),
      studentId,
      'no_paga',
      0,
    );

    const saved = await this.tuitionRepository.save(tuition);
    return { tuition: saved };
  }
}
