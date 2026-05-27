import { AuditLog } from '../../entities/audit-log.entity';

export abstract class AuditLogRepositoryPort {
  abstract save(auditLog: AuditLog): Promise<AuditLog>;
  abstract findByUserId(userId: string): Promise<AuditLog[]>;
  abstract findByEntity(entity: string, entityId: string): Promise<AuditLog[]>;
}
