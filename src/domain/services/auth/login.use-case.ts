import { User } from '../../entities/user.entity';
import { UserRepositoryPort } from '../../ports/outbound/user-repository.port';
import { PasswordHasherPort } from '../../ports/outbound/password-hasher.port';
import { TokenGeneratorPort } from '../../ports/outbound/token-generator.port';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    const isValid = await this.passwordHasher.compare(
      input.password,
      user.password,
    );
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    user.updateLoginTimestamp();
    await this.userRepository.update(user);

    const accessToken = this.tokenGenerator.generate({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenGenerator.generateRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, accessToken, refreshToken };
  }
}
