export class AssignmentEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly subjectId: string,
    public readonly teacherId: string,
    public readonly dueDate: Date,
    public readonly maxScore: number,
    public readonly createdAt?: Date,
  ) {}
}
