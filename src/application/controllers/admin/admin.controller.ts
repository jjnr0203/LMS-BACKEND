import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { CreateUserUseCase } from '@domain/services/admin/create-user.use-case';
import { CreateUserDto } from '../../dto/admin/create-user.dto';
import { AdminResponseDto } from '../../dto/admin/admin-response.dto';
import { GetDashboardStatsUseCase } from '@domain/services/admin/get-dashboard-stats.use-case';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
  ) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    const stats = await this.getDashboardStatsUseCase.execute();
    return { stats };
  }

  @Post('users')
  async createUser(@Body() dto: CreateUserDto) {
    const { user } = await this.createUserUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      roleName: dto.roleName,
      birthDate: dto.birthDate,
      phone: dto.phone,
    });
    return {
      message: 'Usuario creado exitosamente',
      user: AdminResponseDto.fromEntity(user),
    };
  }
}
