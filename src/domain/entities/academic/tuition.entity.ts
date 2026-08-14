export type TuitionStatus = 'pago_total' | 'pendiente' | 'convenio' | 'no_paga';

export class TuitionEntity {
  constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly status: TuitionStatus,
    public readonly paidInstallments: number,
  ) {}
}
