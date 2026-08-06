export class StudentEntity {
  constructor(
    public readonly id: string, // Cédula
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly isActive: boolean,
    public readonly birthDate?: Date,
    public readonly phone?: string,
    public readonly avatarUrl?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {}
}