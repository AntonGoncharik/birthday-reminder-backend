import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import uniqid from 'uniqid';

import { DatabaseService } from '@database/database.service';
import { MailService } from '@mail/mail.service';
import { UsersService } from '@api/users/users.service';
import { CreateUserDto } from '@api/users/dto';
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

  async signin(userDto: CreateUserDto) {
    try {
      const user = await this.validateUserPassword(userDto);
      const tokens = this.generateTokens(user.id, userDto);

      await this.databaseService.query(
        `UPDATE tokens
          SET token = ?, refresh_token = ?
          WHERE user_id = ?;
        `,
        [tokens.token, tokens.refreshToken, `${user.id}`],
      );

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatarPath: user.avatarPath,
        },
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async signup(userDto: CreateUserDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      const users = await this.userService.getUserByEmail(userDto.email);

      if (users[0]) {
        throw new BadRequestException({
          message: 'User with this email exists',
        });
      }

      const activationLink = uniqid();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      const hashPassword = await bcrypt.hash(userDto.password, 5);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      const userId = await this.userService.createUser({
        ...userDto,
        password: hashPassword,
        activationLink,
      });
      const tokens = this.generateTokens(`${userId}`, userDto);

      await this.databaseService.query(
        `INSERT INTO tokens (token, refresh_token, user_id)
          VALUES (?, ?, ?);
        `,
        [tokens.token, tokens.refreshToken, `${userId}`],
      );

      await this.mailService.sendMail({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        to: userDto.email,
        subject: BIRTHDAY_REMINDER_REGISTRATION,
        html: getTemplateRegistartionEmail(activationLink),
      });

      return { user: { id: userId }, tokens };
    } catch (error) {
      throw error;
    }
  }

  async active(activationLink: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const users = await this.userService.getUserByActivationLink(
        activationLink,
      );

      if (!users[0]) {
        throw new BadRequestException({
          message: 'User not found',
        });
      }

      if (users[0].active) {
        throw new BadRequestException({
          message: 'User has been activated',
        });
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.userService.updateUser(null, {
        id: users[0].id,
        active: 1,
      });
    } catch (error) {
      throw error;
    }
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

      const tokens = this.generateTokens(result[0].user_id, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        email: user[0].email,
        password: '',
      });

      await this.databaseService.query(
        `UPDATE tokens
          SET token = ?, refresh_token = ?
          WHERE user_id = ?;
        `,
        [tokens.token, tokens.refreshToken, result[0].user_id],
      );

      return {
        user: { id: result[0].user_id },
        tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async verify(token: string, options: { secret: string }) {
    return await this.jwtService.verifyAsync(token, options);
  }

  private generateTokens(userId: string, userDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const payload = { id: userId, email: userDto.email };

    return {
      token: this.jwtService.sign(payload, {
        secret: process.env.JWT_TOKEN_SECRET_KEY,
        expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      }),
    };
  }

  private async validateUserPassword(userDto: CreateUserDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const users = await this.userService.getUserByEmail(`${userDto.email}`);

      if (users[0]) {
        const passwordEquals = await bcrypt.compare(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          userDto.password,
          users[0].password,
        );

        if (passwordEquals) {
          return {
            id: users[0].id,
            firstName: users[0].firstName,
            lastName: users[0].lastName,
            email: users[0].email,
            avatarPath: users[0].avatarPath,
          };
        }
      }

      throw new UnauthorizedException({
        message: 'Invalid email or password',
      });
    } catch (error) {
      throw error;
    }
  }
}
