export class AcademicRecordEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly subjectId: string,
    public readonly academicTermId: string,
    public readonly grade: number,
    public readonly status: string,
    public readonly credits: number,
    public readonly createdAt?: Date,
  ) {}
}
