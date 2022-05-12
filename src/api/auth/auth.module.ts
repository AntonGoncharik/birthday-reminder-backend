import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '@api/users/users.module';
import { MailModule } from '@mail/mail.module';
import { AuthController } from '@api/auth/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  imports: [UsersModule, JwtModule.register(null), MailModule],
  exports: [AuthService],
})
export class AuthModule {}
