export class Curriculum {
  constructor(
    public readonly id: string,
    public careerId: string,
    public name: string,
    public description: string | null,
    public isActive: boolean,
    public createdAt: Date,
  ) {}
}
