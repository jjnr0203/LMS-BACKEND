export class Career {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public durationSemesters: number,
    public modalityId?: string,
    public coordinatorId?: string,
    public isActive: boolean = true,
  ) {}
}
