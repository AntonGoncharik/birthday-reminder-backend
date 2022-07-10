import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '@api/users/users.module';
import { AuthController } from '@api/auth/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  imports: [UsersModule, JwtModule.register(null)],
  exports: [AuthService],
})
export class AuthModule {}
