export class SubmissionEntity {
  constructor(
    public readonly id: string,
    public readonly assignmentId: string,
    public readonly studentId: string,
    public readonly fileUrl: string,
    public readonly grade: number | null,
    public readonly feedback: string | null,
    public readonly submittedAt: Date,
  ) {}
}
