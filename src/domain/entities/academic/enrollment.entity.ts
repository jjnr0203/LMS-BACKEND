export class EnrollmentEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly enrolledAt: Date,
  ) {}
}
