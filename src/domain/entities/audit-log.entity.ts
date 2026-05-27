import { AuditAction } from '../../common/enums/role.enum';

export class AuditLog {
  constructor(
    public readonly id: string,
    public userId: string | null,
    public action: AuditAction,
    public entity: string,
    public entityId: string,
    public oldValues: Record<string, unknown> | null,
    public newValues: Record<string, unknown> | null,
    public ipAddress: string | null,
    public userAgent: string | null,
    public readonly createdAt: Date,
  ) {}
}
