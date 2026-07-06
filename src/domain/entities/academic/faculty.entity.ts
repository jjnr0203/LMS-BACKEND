export class Faculty {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public description: string | null,
    public isActive: boolean,
    public createdAt: Date,
  ) {}
}
