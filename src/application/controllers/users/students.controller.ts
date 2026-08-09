import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { StudentService } from '@domain/services/users/student.service';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const result = await this.studentService.getPaginated(
      pageInt,
      limitInt,
      search,
    );
    return {
      data: result.data.map((student: any) => ({
        ...student,
        roleName: 'student',
      })),
      pagination: {
        total: result.total,
        page: pageInt,
        limit: limitInt,
        lastPage: Math.ceil(result.total / limitInt),
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.getById(id);
  }

  @Post()
  @Roles('admin')
  async create(@Body() body: any) {
    return this.studentService.create(body);
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.studentService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.studentService.delete(id);
    return { message: 'Student deleted successfully' };
  }
}
