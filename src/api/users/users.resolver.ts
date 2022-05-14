import { Resolver, Query, Args } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { User } from './interfaces';

@Resolver('Users')
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query('users')
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Query('user')
  async get(@Args('id') id: string): Promise<User> {
    return this.usersService.getById(id);
  }
}
