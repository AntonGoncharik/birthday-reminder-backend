import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    const gqlReq = ctx.getInfo();

    // http
    if (gqlContext.req.route) {
      if (gqlContext.req.route.path.includes('auth')) {
        return true;
      }
    }
    // graphql
    if (gqlReq.path) {
      if (['signup', 'signin'].includes(gqlReq.path.key)) {
        return true;
      }
    }

    try {
      const authHeader = gqlContext.req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException({
          message: 'authorization header does not exist',
        });
      }

      const type = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (type !== 'jwt') {
        throw new UnauthorizedException({
          message: 'token type is invalid',
        });
      }

      if (!token) {
        throw new UnauthorizedException({
          message: 'token does not exist',
        });
      }

      this.authService.isValidToken(token, {
        secret: process.env.JWT_TOKEN_SECRET_KEY,
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: `user is not logged in: ${error}`,
      });
    }
  }
}
