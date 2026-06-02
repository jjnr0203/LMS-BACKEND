import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../../domain/services/auth/login.use-case';
import { RegisterUseCase } from '../../../domain/services/auth/register.use-case';
import { RefreshUseCase } from '../../../domain/services/auth/refresh.use-case';
import { LogoutUseCase } from '../../../domain/services/auth/logout.use-case';
import { LoginDto } from '../../dto/auth/login.dto';
import { RegisterDto } from '../../dto/auth/register.dto';
import { RefreshTokenDto } from '../../dto/auth/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const { user } = await this.registerUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      passwordRaw: dto.password,
      roleName: dto.roleName,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const { user, accessToken, refreshToken } = await this.loginUseCase.execute({
      emailOrCedula: dto.emailOrCedula,
      passwordRaw: dto.password,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      },
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.refreshUseCase.execute(dto.refreshToken);
    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshTokenDto) {
    await this.logoutUseCase.execute(dto.refreshToken);
    return { message: 'Sesión cerrada exitosamente' };
  }
}
