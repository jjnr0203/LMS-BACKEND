export class Student {
  constructor(
    public readonly userId: string,
    public enrollmentDate: Date,
    public career: string,
    public semester: number,
    public group: string,
    public isActive: boolean,
  ) {}

  advanceSemester(): void {
    this.semester += 1;
  }
}
