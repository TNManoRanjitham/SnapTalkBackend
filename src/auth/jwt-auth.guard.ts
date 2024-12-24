import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = request?.route?.path;

    // Skip JWT validation for 'signup' and 'login' routes
    if (path === '/auth/signup' || path === '/auth/login') {
      return true;
    }

    return super.canActivate(context); // For other routes, proceed with JWT validation
  }
}
