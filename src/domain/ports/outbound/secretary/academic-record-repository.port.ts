import { AcademicRecordEntity } from '../../../entities/secretary/academic-record.entity';

export abstract class AcademicRecordRepositoryPort {
  abstract findByStudentId(studentId: string): Promise<AcademicRecordEntity[]>;
  abstract save(record: AcademicRecordEntity): Promise<AcademicRecordEntity>;
  abstract getAverage(studentId: string): Promise<number>;
  abstract getTotalCredits(studentId: string): Promise<number>;
}
