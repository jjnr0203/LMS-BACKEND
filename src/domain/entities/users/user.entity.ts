export class UserEntity {
  constructor(
    public readonly id: string, // Cédula
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
    public readonly birthDate?: Date,
    public readonly phone?: string,
    public readonly avatarUrl?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
    public readonly roleName?: string,
    public readonly requiresPasswordChange: boolean = true,
    public readonly address?: string,
    public readonly linkedIn?: string,
    public readonly cvUrl?: string | null,
    public readonly certificates: string[] = [],
  ) {}
}
