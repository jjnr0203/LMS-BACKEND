import { randomUUID } from 'node:crypto';
import { User } from '../../entities/user.entity';
import { UserRepositoryPort } from '../../ports/outbound/user-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/password-hasher.port';
import { Role } from '../../../common/enums/role.enum';

export interface RegisterUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface RegisterUserOutput {
  user: User;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const now = new Date();

    const user = new User(
      randomUUID(),
      input.email,
      hashedPassword,
      input.firstName,
      input.lastName,
      input.role,
      true,
      now,
      now,
    );

    const saved = await this.userRepository.save(user);
    return { user: saved };
  }
}
