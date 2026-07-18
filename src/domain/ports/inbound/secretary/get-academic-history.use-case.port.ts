export interface AcademicHistoryResult {
  studentId: string;
  approved: { subjectName: string; grade: number; credits: number; term: string }[];
  failed: { subjectName: string; grade: number; credits: number; term: string }[];
  average: number;
  totalCredits: number;
}

export abstract class GetAcademicHistoryUseCasePort {
  abstract execute(studentId: string): Promise<AcademicHistoryResult>;
}
