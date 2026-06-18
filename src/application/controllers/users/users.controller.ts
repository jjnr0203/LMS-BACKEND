import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request as ReqDecorator,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { GetPaginatedUsersUseCase } from '@domain/services/users/get-paginated-users.use-case';
import { GetUserByIdUseCase } from '@domain/services/users/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@domain/services/users/update-user.use-case';
import { UpdatePasswordUseCase } from '@domain/services/users/update-password.use-case';
import { SoftDeleteUserUseCase } from '@domain/services/users/soft-delete-user.use-case';
import { UploadAvatarUseCase } from '@domain/services/users/upload-avatar.use-case';
import { UpdateUserDto } from '../../dto/users/update-user.dto';
import { UpdatePasswordDto } from '../../dto/users/update-password.dto';
import { UserResponseDto } from '../../dto/users/user-response.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly getPaginatedUsersUseCase: GetPaginatedUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly softDeleteUserUseCase: SoftDeleteUserUseCase,
    private readonly uploadAvatarUseCase: UploadAvatarUseCase,
  ) {}

  @Get()
  @Roles('admin', 'treasury', 'coordinator', 'teacher')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('role') role: string | undefined,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    if (req.user.role === 'treasury') {
      role = 'student';
    }
    const host = req.headers.host || 'localhost:3000';
    const result = await this.getPaginatedUsersUseCase.execute(
      { page: parseInt(page, 10), limit: parseInt(limit, 10), role },
      host,
    );
    return {
      ...result,
      data: result.data.map((user) => {
        const dto = UserResponseDto.fromEntity(user);
        delete dto.avatarUrl;
        return dto;
      }),
    };
  }

  @Get('me')
  async getProfile(@ReqDecorator() req: AuthenticatedRequest) {
    const user = await this.getUserByIdUseCase.execute(req.user.id);
    return UserResponseDto.fromEntity(user);
  }

  @Get(':id')
  @Roles('admin', 'treasury')
  async findOne(@Param('id') id: string, @ReqDecorator() req: AuthenticatedRequest) {
    const user = await this.getUserByIdUseCase.execute(id);
    if (req.user.role === 'treasury' && user.roleName !== 'student') {
      throw new BadRequestException('Unauthorized to view this user');
    }
    return UserResponseDto.fromEntity(user);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    if (!file) {
      throw new BadRequestException('Ningún archivo enviado');
    }
    const { user } = await this.uploadAvatarUseCase.execute(
      req.user.id,
      file.buffer,
    );
    return {
      message: 'Avatar actualizado exitosamente',
      user: UserResponseDto.fromEntity(user),
    };
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    if (req.user.role !== 'admin' && req.user.id !== id) {
      if (req.user.role === 'treasury') {
        const targetUser = await this.getUserByIdUseCase.execute(id);
        if (targetUser.roleName !== 'student') {
          throw new BadRequestException('Unauthorized to update this user');
        }
      } else {
        throw new BadRequestException('Unauthorized to update this user');
      }
    }
    const { user } = await this.updateUserUseCase.execute({ id, ...dto });
    return { user: UserResponseDto.fromEntity(user) };
  }

  @Patch('me/password')
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @ReqDecorator() req: AuthenticatedRequest,
  ) {
    await this.updatePasswordUseCase.execute({
      id: req.user.id,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Delete(':id')
  @Roles('admin', 'treasury')
  async remove(@Param('id') id: string, @ReqDecorator() req: AuthenticatedRequest) {
    if (req.user.role === 'treasury') {
      const targetUser = await this.getUserByIdUseCase.execute(id);
      if (targetUser.roleName !== 'student') {
        throw new BadRequestException('Unauthorized to delete this user');
      }
    }
    await this.softDeleteUserUseCase.execute(id);
    return { message: 'User deleted successfully' };
  }
}
