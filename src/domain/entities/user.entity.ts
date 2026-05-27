import { Role } from '../../common/enums/role.enum';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public role: Role,
    public isActive: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public lastLoginAt?: Date | null,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isProfileComplete(): boolean {
    return !!this.firstName && !!this.lastName && !!this.email;
  }

  updateLoginTimestamp(): void {
    this.lastLoginAt = new Date();
  }
}
