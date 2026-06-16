export class StudentSubjectEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly subjectId: string,
    public readonly teacherId: string,
    public readonly enrolledAt: Date,
  ) {}
}
