import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { requestContext } from '../../context/request-context';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (user && user.id) {
      const store = requestContext.getStore();
      if (store) store.userId = user.id;
    }
    return super.handleRequest(err, user, info, context, status);
  }
}

