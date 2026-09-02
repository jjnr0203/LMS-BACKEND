import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuditLogOrmEntity } from '../entities/audit/audit-log.orm-entity';
import { requestContext } from '../../context/request-context';

const EXCLUDED_ENTITIES = [
  'AuditLogOrmEntity',
  'RefreshTokenOrmEntity',
];

@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(private dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  private isAuditable(entityName: string): boolean {
    if (!entityName) return false;
    return !EXCLUDED_ENTITIES.includes(entityName);
  }

  async beforeUpdate(event: UpdateEvent<any>) {
    const entityName = event.metadata.targetName;
    if (!this.isAuditable(entityName)) return;

    if (!event.databaseEntity) {
      const primaryColumn = event.metadata.primaryColumns[0];
      if (primaryColumn) {
        const idValue = event.entity && event.entity[primaryColumn.propertyName];
        if (idValue) {
          event.databaseEntity = await event.manager.findOne(event.metadata.target, {
            where: { [primaryColumn.propertyName]: idValue }
          });
        }
      }
    }
  }

  async beforeRemove(event: RemoveEvent<any>) {
    const entityName = event.metadata.targetName;
    if (!this.isAuditable(entityName)) return;

    if (!event.databaseEntity && event.entityId) {
      const primaryColumn = event.metadata.primaryColumns[0];
      if (primaryColumn) {
        event.databaseEntity = await event.manager.findOne(event.metadata.target, {
          where: { [primaryColumn.propertyName]: event.entityId }
        });
      }
    }
  }

  async afterInsert(event: InsertEvent<any>) {
    if (!event.entity) return;
    const entityName = event.metadata.targetName;
    if (!this.isAuditable(entityName)) return;

    try {
      const audit = new AuditLogOrmEntity();
      audit.action = 'INSERT';
      audit.entityName = event.metadata.tableName;

      const primaryColumn = event.metadata.primaryColumns[0];
      if (primaryColumn) {
        audit.entityId = String(event.entity[primaryColumn.propertyName] ?? '');
      } else {
        audit.entityId = 'unknown';
      }

      audit.newValues = event.entity;
      audit.userId = requestContext.getStore()?.userId || 'system';

      await event.manager.save(AuditLogOrmEntity, audit);
    } catch (err) {
      console.error('AuditLog error (afterInsert):', err);
    }
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (!event.entity) return;
    const entityName = event.metadata.targetName;
    if (!this.isAuditable(entityName)) return;

    try {
      const audit = new AuditLogOrmEntity();
      
      const isSoftDelete = (event.entity.deletedAt !== undefined && event.entity.deletedAt !== null) || 
                           (event.entity.deleted_at !== undefined && event.entity.deleted_at !== null);
      
      audit.action = isSoftDelete ? 'DELETE' : 'UPDATE';
      audit.entityName = event.metadata.tableName;

      const primaryColumn = event.metadata.primaryColumns[0];
      if (primaryColumn) {
        const idValue = event.entity[primaryColumn.propertyName] ?? event.databaseEntity?.[primaryColumn.propertyName];
        audit.entityId = idValue ? String(idValue) : 'unknown';
      } else {
        audit.entityId = 'unknown';
      }

      audit.oldValues = event.databaseEntity ?? {};
      audit.newValues = event.entity;
      audit.userId = requestContext.getStore()?.userId || 'system';

      await event.manager.save(AuditLogOrmEntity, audit);
    } catch (err) {
      console.error('AuditLog error (afterUpdate):', err);
    }
  }

  async afterRemove(event: RemoveEvent<any>) {
    const entityName = event.metadata.targetName;
    if (!this.isAuditable(entityName)) return;

    try {
      const audit = new AuditLogOrmEntity();
      audit.action = 'DELETE';
      audit.entityName = event.metadata.tableName;

      const primaryColumn = event.metadata.primaryColumns[0];
      if (primaryColumn && event.entityId) {
        audit.entityId = String(event.entityId);
      } else if (event.databaseEntity && primaryColumn) {
        audit.entityId = String(event.databaseEntity[primaryColumn.propertyName]);
      } else {
        audit.entityId = 'unknown';
      }

      audit.oldValues = event.databaseEntity ?? event.entity;
      audit.userId = requestContext.getStore()?.userId || 'system';

      await event.manager.save(AuditLogOrmEntity, audit);
    } catch (err) {
      console.error('AuditLog error (afterRemove):', err);
    }
  }
}
