export class SubjectEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public credits: number,
    public modalityIds: string[] = [],
    public teacherId?: string,
    public description?: string,
  ) {}
}
