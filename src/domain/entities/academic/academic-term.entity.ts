export class AcademicTerm {
  constructor(
    public readonly id: string,
    public name: string,
    public startDate: Date,
    public endDate: Date,
    public isActive: boolean,
  ) {}
}
