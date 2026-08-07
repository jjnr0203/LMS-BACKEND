export class InstitutionConfigEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public ruc: string | null,
    public slogan: string | null,
    public logoUrl: string | null,
    public address: string | null,
    public phone: string | null,
    public mobile: string | null,
    public email: string | null,
    public website: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}
}
