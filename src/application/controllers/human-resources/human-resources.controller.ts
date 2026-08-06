import { Controller, Post, Body, UseGuards, Get, BadRequestException, Query, Request as ReqDecorator } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { CreateUserUseCase } from '@domain/services/admin/create-user.use-case';
import { GetPaginatedUsersUseCase } from '@domain/services/users/get-paginated-users.use-case';
import { GetDashboardStatsUseCase } from '@domain/services/admin/get-dashboard-stats.use-case';
import { CreateUserDto } from '../../dto/admin/create-user.dto';
import { AdminResponseDto } from '../../dto/admin/admin-response.dto';

@Controller('human-resources')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('human_resources')
export class HumanResourcesController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getPaginatedUsersUseCase: GetPaginatedUsersUseCase,
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
  ) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    const stats = await this.getDashboardStatsUseCase.execute();
    return { stats };
  }

  @Get('staff')
  async getStaff(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role?: string,
    @Query('search') search?: string,
    @ReqDecorator() req?: any,
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Si no hay rol especificado, traer solo los que HR maneja
    let rolesToSearch: string | string[] | undefined = role;
    if (!rolesToSearch) {
      rolesToSearch = ['coordinator', 'secretary', 'treasury', 'teacher'];
    }

    const host = req?.headers?.host || 'localhost:3000';
    const result = await this.getPaginatedUsersUseCase.execute({ page: pageNum, limit: limitNum, role: rolesToSearch, search }, host);

    return {
      data: result.data.map(u => AdminResponseDto.fromEntity(u)),
      total: result.pagination.total,
      page: pageNum,
      limit: limitNum,
    };
  }

  @Post('staff')
  async createStaff(@Body() dto: CreateUserDto) {
    const allowedRoles = ['coordinator', 'secretary', 'treasury', 'teacher'];
    if (!allowedRoles.includes(dto.roleName)) {
      throw new BadRequestException(`El rol ${dto.roleName} no está permitido para ser creado por Recursos Humanos`);
    }
    const { user } = await this.createUserUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      roleName: dto.roleName,
      birthDate: dto.birthDate,
      phone: dto.phone,
      facultyIds: dto.facultyIds,
    });
    return {
      message: 'Personal creado exitosamente',
      user: AdminResponseDto.fromEntity(user),
    };
  }
}
