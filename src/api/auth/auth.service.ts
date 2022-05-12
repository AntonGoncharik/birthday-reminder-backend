import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseService } from '@database/database.service';
import { MailService } from '@mail/mail.service';
import { UsersService } from '@api/users/users.service';
import { User } from '@api/users/interfaces';
import { Auth, Signup, Signin } from './interfaces';
import { create, update } from './auth.repository';
import { getTemplateRegistartionEmail } from './templates';
import { BIRTHDAY_REMINDER_REGISTRATION } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private databaseService: DatabaseService,
  ) {}

  async signin(payload: Auth): Promise<Signin> {
    try {
      const user = await this.userService.getByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException({
          message: 'user with this email does not exist',
        });
      }

      const isValidPassword = await this.isValidPassword(
        payload.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new UnauthorizedException({
          message: 'invalid password',
        });
      }

      const token = this.generateTokens(user);

      const createdToken = await this.databaseService.query(update, [
        token.accessToken,
        token.refreshToken,
        user.id,
      ]);

      return { user: user, token: createdToken[0] };
    } catch (error) {
      throw error;
    }
  }

  async signup(payload: Auth): Promise<Signup> {
    try {
      const existedUser = await this.userService.getByEmail(payload.email);

      if (existedUser) {
        throw new UnauthorizedException({
          message: 'user with this email exists',
        });
      }

      const activationLink = uuidv4();

      await this.mailService.sendMail({
        from: process.env.MAIL_USER,
        to: payload.email,
        subject: BIRTHDAY_REMINDER_REGISTRATION,
        html: getTemplateRegistartionEmail(activationLink),
      });

      const hashPassword = await bcrypt.hash(payload.password, 5);

      const user = await this.userService.createUser({
        email: payload.email,
        password: hashPassword,
        activationLink,
      });

      const token = this.generateTokens(user);

      const createdToken = await this.databaseService.query(create, [
        user.id,
        token.accessToken,
        token.refreshToken,
      ]);

      return { user: user, token: createdToken[0] };
    } catch (error) {
      throw error;
    }
  }

  async active(activationLink: string) {
    console.log(activationLink);
    // try {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   const users = await this.userService.getUserByActivationLink(
    //     activationLink,
    //   );

    //   if (!users[0]) {
    //     throw new BadRequestException({
    //       message: 'User not found',
    //     });
    //   }

    //   if (users[0].active) {
    //     throw new BadRequestException({
    //       message: 'User has been activated',
    //     });
    //   }

    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   await this.userService.updateUser(null, {
    //     id: users[0].id,
    //     active: 1,
    //   });
    // } catch (error) {
    //   throw error;
    // }
  }

  async refresh(authorizationTokens: string) {
    try {
      const token = authorizationTokens.split(' ')[1];
      const refreshToken = authorizationTokens.split(' ')[2];
      console.log(token);
      const result = await this.databaseService.query(
        `SELECT refresh_token, user_id
          FROM tokens
          WHERE refresh_token = ?
          LIMIT 1;
        `,
        [refreshToken],
      );

      if (!result[0]) {
        throw new BadRequestException({
          message: 'Refresh token not found',
        });
      }

      const user = await this.databaseService.query(
        `SELECT email
          FROM users
          WHERE id = ?
          LIMIT 1;
        `,
        [result[0].user_id],
      );

      const tokens = this.generateTokens(result[0].user_id);

      await this.databaseService.query(
        `UPDATE tokens
          SET token = ?, refresh_token = ?
          WHERE user_id = ?;
        `,
        [tokens.accessToken, tokens.refreshToken, result[0].user_id],
      );

      return {
        user: { id: result[0].user_id },
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async isValidToken(token: string, options: { secret: string }) {
    return await this.jwtService.verifyAsync(token, options);
  }

  private generateTokens(user: User) {
    const payload = { id: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_TOKEN_SECRET_KEY,
        expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      }),
    };
  }

  private async isValidPassword(
    incomingPassword: string,
    existedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(incomingPassword, existedPassword);
    } catch (error) {
      throw error;
    }
  }
}
