import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';
import { RoleRepositoryPort } from '@domain/ports/outbound/users/role-repository.port';
import { ROLE_PERMISSION_REPOSITORY } from '@domain/ports/outbound/academic/role-permission-repository.port';
import type { RolePermissionRepositoryPort } from '@domain/ports/outbound/academic/role-permission-repository.port';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    @Inject(ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissionRepository: RolePermissionRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    const dbUser = await this.userRepository.findById(user.id);
    if (!dbUser || !dbUser.isActive) {
      throw new ForbiddenException(
        'Su cuenta ha sido suspendida. Contacte a tesorería.',
      );
    }

    if (requiredRoles && requiredRoles.includes(user.role)) {
      return true;
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const dbRole = await this.roleRepository.findByName(user.role);
      if (!dbRole) return false;
      const assigned = await this.rolePermissionRepository.findByRole(dbRole.id);
      const userPermissionCodes = assigned.map((rp) => rp.permissionId);
      return requiredPermissions.some((p) => userPermissionCodes.includes(p));
    }

    return false;
  }
}
