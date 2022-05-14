import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { DatabaseService } from '@database/database.service';
import { MailService } from '@mail/mail.service';
import { UsersService } from '@api/users/users.service';
import { User } from '@api/users/interfaces';
import { Auth, UserToken, Redirect } from './interfaces';
import { create, update, getByRefresh } from './auth.repository';
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

  async signin(payload: Auth): Promise<UserToken> {
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

      const token = await this.generateToken(user);

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

  async signup(payload: Auth): Promise<UserToken> {
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

      const user = await this.userService.create({
        email: payload.email,
        password: hashPassword,
        activationLink,
      });

      const token = await this.generateToken(user);

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

  async active(activationLink: string): Promise<Redirect> {
    try {
      const user = await this.userService.getByActivationLink(activationLink);

      if (!user) {
        throw new UnauthorizedException({
          message: 'user not found',
        });
      }

      if (user.activated) {
        return { url: process.env.UI_URL };
      }

      await this.userService.update(user.id, {
        activated: true,
      });

      return { url: process.env.UI_URL };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(tokensInput: string): Promise<UserToken> {
    try {
      const refreshToken = tokensInput.split(' ')[1];

      const existedToken = await this.databaseService.query(getByRefresh, [
        refreshToken,
      ]);

      if (!existedToken[0]) {
        throw new UnauthorizedException({
          message: 'refresh token not found',
        });
      }

      const user = await this.userService.getById(existedToken[0].userId);

      if (!user) {
        throw new UnauthorizedException({
          message: 'user not found',
        });
      }

      const token = await this.generateToken(user);

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

  isValidToken(token: string, options: { secret: string }) {
    return this.jwtService.verify(token, options);
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_TOKEN_SECRET_KEY,
      expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return {
      accessToken,
      refreshToken,
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
