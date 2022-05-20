import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@database/database.service';
import {
  getById,
  create,
  getUpdate,
  getAll,
} from './birthday-people.repository';
import { Create, BirthdayMan, Update } from './interfaces';
import { getSQLUpdate } from '@common/utilities';

@Injectable()
export class BirthdayPeopleService {
  constructor(private databaseService: DatabaseService) {}

  async getAll(): Promise<BirthdayMan[]> {
    try {
      const birthdayPeople = await this.databaseService.query(getAll);

      return birthdayPeople;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<BirthdayMan> {
    try {
      const birthdayMan = await this.databaseService.query(getById, [id]);

      return birthdayMan[0];
    } catch (error) {
      throw error;
    }
  }

  async create(payload: Create): Promise<BirthdayMan> {
    try {
      const birthdayMan = await this.databaseService.query(create, [
        payload.userId,
        payload.firstName,
        payload.lastName,
        payload.birthDate,
      ]);

      return birthdayMan[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, payload: Update): Promise<BirthdayMan> {
    try {
      const sqlUpdate = getSQLUpdate(id, payload);
      const values = Object.values(payload);
      values.push(id);

      const birthdayMan = await this.databaseService.query(
        getUpdate(sqlUpdate),
        values,
      );

      return birthdayMan[0];
    } catch (error) {
      throw error;
    }
  }
}
