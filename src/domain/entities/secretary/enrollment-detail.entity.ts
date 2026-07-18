export class EnrollmentDetailEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly academicTermId: string,
    public readonly careerId: string,
    public readonly level: number,
    public readonly status: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {}
}
