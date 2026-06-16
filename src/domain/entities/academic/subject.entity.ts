export class SubjectEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly credits: number,
    public readonly coordinatorId: string,
    public readonly description?: string,
  ) {}
}
