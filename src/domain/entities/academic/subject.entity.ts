export class SubjectEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public credits: number,
    public hours: number = 0,
    public teacherId?: string,
    public description?: string,
  ) {}
}
