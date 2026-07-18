export class InscriptionEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly careerId: string,
    public readonly status: string,
    public readonly documentUrl?: string,
    public readonly notes?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {}
}
