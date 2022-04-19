import { Resolver, Query } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { DatabaseService } from '@database/database.service';

@Resolver('Users')
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private databaseService: DatabaseService,
  ) {}

  @Query('users')
  async getUsers() {
    const result = await this.databaseService.query('SELECT * FROM users');
    console.log(result);
    return result;
  }
}
