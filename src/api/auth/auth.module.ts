import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UsersModule } from '@api/users/users.module';
import { MailModule } from '@mail/mail.module';

@Module({
  providers: [AuthService],
  imports: [UsersModule, JwtModule.register(null), MailModule],
  exports: [AuthService],
})
export class AuthModule {}
