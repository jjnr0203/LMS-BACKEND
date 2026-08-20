import { MailerService } from '@nestjs-modules/mailer';
import { UserRepositoryPort } from '../../ports/outbound/users/user-repository.port';
import * as crypto from 'crypto';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly mailerService: MailerService,
  ) {}

  async execute(dto: { email: string }): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      // Return same message to avoid email enumeration
      return { message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const updatedUser = {
      ...user,
      resetPasswordToken: tokenHash,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };

    // Need to cast to any or construct full entity if fields are readonly?
    // Wait, UserEntity properties are public readonly, but we can bypass this or construct a new entity?
    // Oh, since we're using classes with constructors, we should just use the constructor or Object.assign
    // Let's create a new UserEntity or Object.assign to it.
    
    // Better way to copy:
    const userWithToken = Object.assign(Object.create(Object.getPrototypeOf(user)), user, {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000)
    });

    await this.userRepository.save(userWithToken);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperación de contraseña',
      template: './reset-password',
      context: {
        resetUrl,
      },
    });

    return { message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
  }
}
