import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { TeacherService } from '@domain/services/users/teacher.service';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeachersController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  @Roles('admin', 'treasury', 'coordinator', 'teacher', 'human_resources')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const result = await this.teacherService.getPaginated(pageInt, limitInt, search);
    return {
      data: result.data.map((teacher: any) => ({
        ...teacher,
        roleName: 'teacher',
      })),
      pagination: {
        total: result.total,
        page: pageInt,
        limit: limitInt,
        lastPage: Math.ceil(result.total / limitInt),
      }
    };
  }

  @Get(':id')
  @Roles('admin', 'treasury', 'coordinator', 'teacher', 'human_resources')
  async findOne(@Param('id') id: string) {
    return this.teacherService.getById(id);
  }

  @Get(':id/stats')
  @Roles('admin', 'treasury', 'coordinator', 'teacher', 'human_resources')
  async getStats(@Param('id') id: string) {
    return this.teacherService.getStats(id);
  }

  @Post()
  @Roles('admin', 'human_resources')
  async create(@Body() body: any) {
    return this.teacherService.create(body);
  }

  @Patch(':id')
  @Roles('admin', 'human_resources')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.teacherService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin', 'human_resources')
  async remove(@Param('id') id: string) {
    await this.teacherService.delete(id);
    return { message: 'Teacher deleted successfully' };
  }
}