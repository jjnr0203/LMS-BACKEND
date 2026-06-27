export class CareerSubject {
  constructor(
    public readonly id: string,
    public careerId: string,
    public subjectId: string,
    public semester: number,
    public curriculumId?: string,
  ) {}
}
