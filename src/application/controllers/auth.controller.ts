import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginUseCase } from '../../domain/services/auth/login.use-case';
import { RegisterUserUseCase } from '../../domain/services/auth/register.use-case';
import { LocalAuthGuard } from '../../infrastructure/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { GoogleOAuthGuard } from '../../infrastructure/auth/guards/google-oauth.guard';
import { TokenGeneratorPort } from '../../domain/ports/outbound/token-generator.port';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    const { user } = await this.registerUseCase.execute({
      email: dto.email,
      password: dto.password,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
    });

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

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const { user, accessToken, refreshToken } = await this.loginUseCase.execute(
      {
        email: dto.email,
        password: dto.password,
      },
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      accessToken,
      refreshToken,
    };
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  googleAuth(): void {
    // Redirects to Google OAuth consent screen
  }

  @UseGuards(GoogleOAuthGuard)
  @Get('google/callback')
  googleAuthRedirect(
    @Req()
    req: {
      user: { email: string; firstName: string; lastName: string };
    },
  ): {
    message: string;
    user: { email: string; firstName: string; lastName: string };
  } {
    return {
      message: 'Google authentication successful',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Req() req: { user: { id: string; email: string; role: string } },
  ): { id: string; email: string; role: string } {
    return req.user;
  }
}
