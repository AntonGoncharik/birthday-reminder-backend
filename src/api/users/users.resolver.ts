import { Resolver, Query } from '@nestjs/graphql';

import { UsersService } from './users.service';

@Resolver('Users')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('users')
  async getUsers() {
    return [
      {
        id: '1',
        name: '1',
      },
    ];
  }
}
