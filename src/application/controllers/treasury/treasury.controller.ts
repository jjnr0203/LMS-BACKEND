import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { ListTuitionsUseCase } from '@domain/services/treasury/list-tuitions.use-case';
import { RegisterPaymentUseCase } from '@domain/services/treasury/register-payment.use-case';
import { DisableAccountUseCase } from '@domain/services/treasury/disable-account.use-case';
import { RegisterStudentUseCase } from '@domain/services/treasury/register-student.use-case';
import { RegisterStudentDto } from '../../dto/treasury/register-student.dto';
import { AdminResponseDto } from '../../dto/admin/admin-response.dto';
import { RegisterPaymentDto } from '../../dto/treasury/register-payment.dto';
import { DisableAccountDto } from '../../dto/treasury/disable-account.dto';

@Controller('treasury')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('treasury')
export class TreasuryController {
  constructor(
    private readonly listTuitionsUseCase: ListTuitionsUseCase,
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly disableAccountUseCase: DisableAccountUseCase,
    private readonly registerStudentUseCase: RegisterStudentUseCase,
  ) {}

  @Get('matriculas')
  async listTuitions() {
    const { tuitions } = await this.listTuitionsUseCase.execute();
    return { tuitions };
  }

  @Post('estudiantes')
  async registerStudent(@Body() dto: RegisterStudentDto) {
    const { user, tuition } = await this.registerStudentUseCase.execute({
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      birthDate: dto.birthDate,
      phone: dto.phone,
    });
    return {
      message: 'Estudiante registrado exitosamente',
      user: AdminResponseDto.fromEntity(user),
      tuition: {
        status: tuition.status,
        paidInstallments: tuition.paidInstallments,
      },
    };
  }

  @Post('abonos')
  async registerPayment(@Body() dto: RegisterPaymentDto) {
    const { tuition } = await this.registerPaymentUseCase.execute({
      studentId: dto.studentId,
    });
    return {
      message: 'Abono registrado exitosamente',
      tuition: {
        studentId: tuition.studentId,
        status: tuition.status,
        paidInstallments: tuition.paidInstallments,
      },
    };
  }

  @Post('deshabilitar')
  async disableAccount(@Body() dto: DisableAccountDto) {
    const result = await this.disableAccountUseCase.execute({
      studentId: dto.studentId,
    });
    return {
      message: 'Cuenta deshabilitada por falta de pago',
      user: {
        id: result.user.id,
        isActive: result.user.isActive,
      },
      tuition: {
        studentId: result.tuition.studentId,
        status: result.tuition.status,
      },
    };
  }
}
