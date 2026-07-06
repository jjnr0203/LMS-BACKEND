export class Career {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public durationSemesters: number,
    public modalityIds: string[],
    public coordinatorId?: string,
    public isActive: boolean = true,
    public facultyId?: string,
  ) {}
}
