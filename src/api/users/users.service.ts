import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@database/database.service';
import { getByEmail, create } from './users.repository';
import { Create, User } from './interfaces';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async getByEmail(email: string) {
    try {
      const user = await this.databaseService.query(getByEmail, [email]);

      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async createUser(payload: Create): Promise<User> {
    try {
      const user = await this.databaseService.query(create, [
        payload.email,
        payload.password,
        payload.activationLink,
      ]);

      return user[0];
    } catch (error) {
      throw error;
    }
  }
}
