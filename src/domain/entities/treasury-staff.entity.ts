export class TreasuryStaff {
  constructor(
    public readonly userId: string,
    public hireDate: Date,
    public position: string,
    public isActive: boolean,
  ) {}
}
