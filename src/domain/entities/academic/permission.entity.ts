export class Permission {
  constructor(
    public readonly id: string,
    public name: string,
    public code: string,
    public description: string | null,
    public resource: string,
    public createdAt: Date,
  ) {}
}
