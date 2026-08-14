import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { ListMatriculasUseCase } from '@domain/services/treasury/list-matriculas.use-case';
import { RegisterPaymentUseCase } from '@domain/services/treasury/register-payment.use-case';
import { CompleteTuitionUseCase } from '@domain/services/treasury/complete-tuition.use-case';
import { CreateConvenioUseCase } from '@domain/services/treasury/create-convenio.use-case';
import { DisableAccountUseCase } from '@domain/services/treasury/disable-account.use-case';
import { GetTreasuryDashboardUseCase } from '@domain/services/treasury/get-treasury-dashboard.use-case';
import { RegisterPaymentDto } from '../../dto/treasury/register-payment.dto';
import { DisableAccountDto } from '../../dto/treasury/disable-account.dto';

@Controller('treasury')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('treasury')
export class TreasuryController {
  constructor(
    private readonly listMatriculasUseCase: ListMatriculasUseCase,
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly completeTuitionUseCase: CompleteTuitionUseCase,
    private readonly createConvenioUseCase: CreateConvenioUseCase,
    private readonly disableAccountUseCase: DisableAccountUseCase,
    private readonly getTreasuryDashboardUseCase: GetTreasuryDashboardUseCase,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    const { stats, recentTuitions } = await this.getTreasuryDashboardUseCase.execute();
    return { stats, recentTuitions };
  }

  @Get('matriculas')
  async listTuitions() {
    const { data } = await this.listMatriculasUseCase.execute();
    return { data };
  }

  @Post('matriculas/:studentId/pago-completo')
  async completeTuition(@Param('studentId') studentId: string) {
    const { tuition } = await this.completeTuitionUseCase.execute(studentId);
    return {
      message: 'Matrícula marcada como pago completo',
      tuition: {
        studentId: tuition.studentId,
        status: tuition.status,
        paidInstallments: tuition.paidInstallments,
      },
    };
  }

  @Post('matriculas/:studentId/convenio')
  async createConvenio(@Param('studentId') studentId: string) {
    const { tuition } = await this.createConvenioUseCase.execute(studentId);
    return {
      message: 'Convenio creado exitosamente',
      tuition: {
        studentId: tuition.studentId,
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
