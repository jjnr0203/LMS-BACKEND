import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../infrastructure/auth/guards/roles.guard';
import { Roles } from '../../../infrastructure/auth/decorators/roles.decorator';
import { ListTuitionsUseCase } from '../../../domain/services/treasury/list-tuitions.use-case';
import { RegisterPaymentUseCase } from '../../../domain/services/treasury/register-payment.use-case';
import { DisableAccountUseCase } from '../../../domain/services/treasury/disable-account.use-case';
import { RegisterPaymentDto } from '../../dto/treasury/register-payment.dto';
import { DisableAccountDto } from '../../dto/treasury/disable-account.dto';

@Controller('tesoreria')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('tesoreria')
export class TreasuryController {
  constructor(
    private readonly listTuitionsUseCase: ListTuitionsUseCase,
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly disableAccountUseCase: DisableAccountUseCase,
  ) {}

  @Get('matriculas')
  async listTuitions() {
    const { tuitions } = await this.listTuitionsUseCase.execute();
    return { tuitions };
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
