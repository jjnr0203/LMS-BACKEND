import { Controller, Get, Delete, Query, Param, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { JwtAuthGuard } from '@infrastructure/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@infrastructure/auth/guards/roles.guard';
import { Roles } from '@infrastructure/auth/decorators/roles.decorator';
import { AuditLogOrmEntity } from '@infrastructure/database/entities/audit/audit-log.orm-entity';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AuditLogsController {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly auditRepo: Repository<AuditLogOrmEntity>,
  ) {}

  @Get()
  async getLogs(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('module') moduleName?: string,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const query = this.auditRepo
      .createQueryBuilder('audit')
      .leftJoin('users', 'u', 'audit.user_id = u.id')
      .leftJoin('roles', 'r', 'u.role_id = r.id')
      .select([
        'audit.id',
        'audit.userId',
        'audit.action',
        'audit.entityName',
        'audit.entityId',
        'audit.oldValues',
        'audit.newValues',
        'audit.createdAt',
        'u.first_name',
        'u.last_name',
        'r.name',
      ]);

    if (moduleName) query.andWhere('audit.entity_name = :moduleName', { moduleName });
    if (action) query.andWhere('audit.action = :action', { action });
    if (startDate) query.andWhere('audit.created_at >= :startDate', { startDate: new Date(startDate) });
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.andWhere('audit.created_at <= :endDate', { endDate: end });
    }

    const totalCount = await query.getCount();

    query.orderBy('audit.createdAt', 'DESC')
         .offset(skip)
         .limit(limitNumber);

    const items = await query.getRawMany();

    const mappedItems = items.map((item) => {
      const fName = item.first_name || item.u_first_name;
      const lName = item.last_name || item.u_last_name;
      const roleName = item.name || item.r_name || 'Sistema';

      let createdAtStr = item.audit_created_at || item.audit_createdAt;
      if (createdAtStr instanceof Date) {
        const d = createdAtStr;
        createdAtStr = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds())).toISOString();
      }

      return {
        id: item.audit_id,
        userId: item.audit_user_id || item.audit_userId,
        userName: fName && lName ? `${fName} ${lName}` : 'Sistema',
        userRole: roleName,
        action: item.audit_action,
        entityName: item.audit_entity_name || item.audit_entityName,
        entityId: item.audit_entity_id || item.audit_entityId,
        oldValues: item.audit_old_values || item.audit_oldValues,
        newValues: item.audit_new_values || item.audit_newValues,
        createdAt: createdAtStr,
      };
    });

    return {
      items: mappedItems,
      total: totalCount,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    };
  }

  @Delete('clear/old')
  async clearOldLogs() {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const result = await this.auditRepo.delete({
      createdAt: LessThan(threeMonthsAgo)
    });
    return { message: 'Registros antiguos eliminados', affected: result.affected };
  }

  @Delete(':id')
  async deleteLog(@Param('id') id: string) {
    await this.auditRepo.delete(id);
    return { message: 'Registro eliminado' };
  }
}
