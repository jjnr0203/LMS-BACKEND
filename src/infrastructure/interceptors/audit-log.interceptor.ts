import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'node:crypto';
import { AuditLogRepositoryPort } from '../../domain/ports/outbound/audit-log-repository.port';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AuditAction } from '../../common/enums/role.enum';

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const METHOD_ACTION_MAP: Record<string, AuditAction> = {
  POST: AuditAction.CREATE,
  PUT: AuditAction.UPDATE,
  PATCH: AuditAction.UPDATE,
  DELETE: AuditAction.DELETE,
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private excludedPaths = ['/api/auth/login', '/api/auth/register'];

  constructor(private readonly auditLogRepository: AuditLogRepositoryPort) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      ip: string;
      headers: { 'user-agent'?: string };
      user?: { id?: string };
      body?: Record<string, unknown>;
      params?: Record<string, string>;
    }>();
    const { method, url } = request;

    if (!MUTATION_METHODS.has(method)) {
      return next.handle();
    }

    if (this.excludedPaths.some((p) => url.startsWith(p))) {
      return next.handle();
    }

    const action = METHOD_ACTION_MAP[method] ?? AuditAction.UPDATE;

    const entityName = this.extractEntityName(url);

    return next.handle().pipe(
      tap({
        next: () => {
          const log = new AuditLog(
            randomUUID(),
            request.user?.id ?? null,
            action,
            entityName,
            request.params?.id ?? 'unknown',
            null,
            request.body as Record<string, unknown> | null,
            request.ip ?? null,
            request.headers['user-agent'] ?? null,
            new Date(),
          );
          this.auditLogRepository.save(log).catch(() => {
            // fail silently — audit should never break the request
          });
        },
      }),
    );
  }

  private extractEntityName(url: string): string {
    const segments = url.split('/').filter(Boolean);
    const resourceIndex = segments.findIndex(
      (s) => s === 'api' || s === 'v1' || s === 'v2',
    );
    const start = resourceIndex >= 0 ? resourceIndex + 1 : 0;
    return segments[start] ?? 'unknown';
  }
}
