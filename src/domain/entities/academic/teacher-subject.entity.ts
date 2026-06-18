export class TeacherSubjectEntity {
  constructor(
    public readonly id: string,
    public readonly teacherId: string,
    public readonly subjectId: string,
    public readonly assignedAt: Date,
  ) {}
}
