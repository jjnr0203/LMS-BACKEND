export interface ManageSemesterColorsUseCasePort {
  getColors(): Promise<{ semester: number; color: string }[]>;
  saveColor(semester: number, color: string): Promise<void>;
}
