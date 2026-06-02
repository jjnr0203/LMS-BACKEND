export class RefreshTokenEntity {
  constructor(
    public readonly id: string, // UUID
    public readonly token: string,
    public readonly userId: string, // Cédula
    public readonly expiresAt: Date,
    public readonly isRevoked: boolean = false,
  ) {}
}
