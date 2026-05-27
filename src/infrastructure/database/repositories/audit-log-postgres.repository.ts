import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogRepositoryPort } from '../../../domain/ports/outbound/audit-log-repository.port';
import { AuditLog } from '../../../domain/entities/audit-log.entity';
import { AuditLogEntity } from '../entities/audit-log.entity';

@Injectable()
export class AuditLogPostgresRepository extends AuditLogRepositoryPort {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly repository: Repository<AuditLogEntity>,
  ) {
    super();
  }

  async save(auditLog: AuditLog): Promise<AuditLog> {
    const entity = this.toEntity(auditLog);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    const entities = await this.repository.find({
      where: { idUser: userId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.toDomain(e));
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    const entities = await this.repository.find({
      where: { entity, entityId },
      order: { createdAt: 'DESC' },
    });
    return entities.map((e) => this.toDomain(e));
  }

  private toDomain(entity: AuditLogEntity): AuditLog {
    return new AuditLog(
      entity.id,
      entity.idUser,
      entity.action as AuditLog['action'],
      entity.entity,
      entity.entityId,
      entity.oldValues,
      entity.newValues,
      entity.ipAddress,
      entity.userAgent,
      entity.createdAt,
    );
  }

  private toEntity(domain: AuditLog): AuditLogEntity {
    const entity = new AuditLogEntity();
    entity.id = domain.id;
    entity.idUser = domain.userId;
    entity.action = domain.action;
    entity.entity = domain.entity;
    entity.entityId = domain.entityId;
    entity.oldValues = domain.oldValues;
    entity.newValues = domain.newValues;
    entity.ipAddress = domain.ipAddress;
    entity.userAgent = domain.userAgent;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
