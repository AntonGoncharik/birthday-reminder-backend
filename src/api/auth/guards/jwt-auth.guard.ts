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
    const { req } = GqlExecutionContext.create(context).getContext();

    return true;

    if (req.path.includes('auth')) {
      return true;
    }

    try {
      const authHeader = req.headers.authorization;
      const type = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (type !== 'jwt') {
        throw new UnauthorizedException({
          message: 'Token type is invalid',
        });
      }

      if (!token) {
        throw new UnauthorizedException({
          message: 'Token does not exist',
        });
      }

      this.authService.isValidToken(token, {
        secret: process.env.JWT_TOKEN_SECRET_KEY,
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: `User is not logged in: ${error}`,
      });
    }
  }
}
