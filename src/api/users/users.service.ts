import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@database/database.service';
import {
  getById,
  getByEmail,
  getByActivationLink,
  create,
  getUpdate,
  getAll,
} from './users.repository';
import { Create, User, Update } from './interfaces';
import { getSQLUpdate } from '@common/utilities';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async getAll(): Promise<User[]> {
    try {
      const users = await this.databaseService.query(getAll);

      return users;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.databaseService.query(getById, [id]);

      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.databaseService.query(getByEmail, [email]);

      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async getByActivationLink(activationLink: string): Promise<User> {
    try {
      const user = await this.databaseService.query(getByActivationLink, [
        activationLink,
      ]);

      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async create(payload: Create): Promise<User> {
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

  async update(id: string, payload: Update): Promise<User> {
    try {
      const sqlUpdate = getSQLUpdate(id, payload);
      const values = Object.values(payload);
      values.push(id);

      const user = await this.databaseService.query(
        getUpdate(sqlUpdate),
        values,
      );

      return user[0];
    } catch (error) {
      throw error;
    }
  }
}
