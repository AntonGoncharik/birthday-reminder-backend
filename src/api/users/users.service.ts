import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@database/database.service';
import { userByEmail } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async getByEmail(email: string) {
    const user = await this.databaseService.query(userByEmail, [email]);
    console.log(user);
  }
}
