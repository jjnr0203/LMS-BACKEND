import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRepositoryPort } from '@domain/ports/outbound/users/user-repository.port';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
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

    return requiredRoles.includes(user.role);
  }
}
