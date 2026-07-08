export class TeacherSubjectEntity {
  constructor(
    public readonly id: string,
    public readonly teacherId: string,
    public readonly subjectId: string,
    public readonly assignedAt: Date,
    public readonly curriculumId?: string,
    public readonly academicTermId?: string,
    public readonly modalityId?: string,
    public readonly jornadaId?: string,
  ) {}
}
