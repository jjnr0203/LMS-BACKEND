import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/guards/roles.guard';
import { Roles } from '../../../infrastructure/auth/decorators/roles.decorator';
import { CreateUserUseCase } from '../../../domain/services/admin/create-user.use-case';
import { CreateUserDto } from '../../dto/admin/create-user.dto';
import { AdminResponseDto } from '../../dto/admin/admin-response.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('users')
  async createUser(@Body() dto: CreateUserDto) {
    const { user } = await this.createUserUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      roleName: dto.roleName,
    });
    return {
      message: 'Usuario creado exitosamente',
      user: AdminResponseDto.fromEntity(user),
    };
  }
}
