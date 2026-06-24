export interface SemesterColorRepositoryPort {
  findAll(): Promise<{ semester: number; color: string }[]>;
  save(semester: number, color: string): Promise<void>;
}
