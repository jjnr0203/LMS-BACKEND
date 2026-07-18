import { GetAcademicHistoryUseCasePort, AcademicHistoryResult } from '@domain/ports/inbound/secretary/get-academic-history.use-case.port';
import { AcademicRecordRepositoryPort } from '@domain/ports/outbound/secretary/academic-record-repository.port';
import { SubjectRepositoryPort } from '@domain/ports/outbound/academic/subject-repository.port';
import { ACADEMIC_TERM_REPOSITORY } from '@domain/ports/outbound/academic/academic-term-repository.port';
import { Inject } from '@nestjs/common';

export class GetAcademicHistoryUseCase implements GetAcademicHistoryUseCasePort {
  constructor(
    private readonly academicRecordRepo: AcademicRecordRepositoryPort,
    private readonly subjectRepo: SubjectRepositoryPort,
    @Inject(ACADEMIC_TERM_REPOSITORY) private readonly academicTermRepo: any,
  ) {}

  async execute(studentId: string): Promise<AcademicHistoryResult> {
    const records = await this.academicRecordRepo.findByStudentId(studentId);
    const average = await this.academicRecordRepo.getAverage(studentId);
    const totalCredits = await this.academicRecordRepo.getTotalCredits(studentId);

    const approved: AcademicHistoryResult['approved'] = [];
    const failed: AcademicHistoryResult['failed'] = [];

    for (const record of records) {
      const subject = await this.subjectRepo.findById(record.subjectId);
      const term = await this.academicTermRepo.findById(record.academicTermId);
      const entry = {
        subjectName: subject?.name ?? 'Desconocida',
        grade: record.grade,
        credits: record.credits,
        term: term?.name ?? 'N/A',
      };

      if (record.status === 'approved') {
        approved.push(entry);
      } else {
        failed.push(entry);
      }
    }

    return { studentId, approved, failed, average, totalCredits };
  }
}
