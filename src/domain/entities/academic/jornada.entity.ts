export class Jornada {
  constructor(
    public readonly id: string,
    public name: string,
    public isActive: boolean,
    public description?: string,
  ) {}
}
