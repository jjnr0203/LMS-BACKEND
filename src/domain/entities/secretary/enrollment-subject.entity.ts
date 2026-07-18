export class EnrollmentSubjectEntity {
  constructor(
    public readonly id: string,
    public readonly enrollmentDetailId: string,
    public readonly subjectId: string,
    public readonly status: string,
    public readonly grade?: number,
    public readonly createdAt?: Date,
  ) {}
}
