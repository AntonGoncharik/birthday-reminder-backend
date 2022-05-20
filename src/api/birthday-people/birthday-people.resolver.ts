import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { BirthdayPeopleService } from './birthday-people.service';
import { CreateBirthdayManDto, UpdateBirthdayManDto } from './dto';
import { BirthdayMan } from './interfaces';

@Resolver('BirthdayPeople')
export class BirthdayPeopleResolver {
  constructor(private birthdayPeopleService: BirthdayPeopleService) {}

  @Query('getAllBirthdayPeople')
  async getAll(): Promise<BirthdayMan[]> {
    return this.birthdayPeopleService.getAll();
  }

  @Query('getBirthdayMan')
  async get(@Args('id') id: string): Promise<BirthdayMan> {
    return this.birthdayPeopleService.getById(id);
  }

  @Mutation('createBirthdayMan')
  async create(@Args() payload: CreateBirthdayManDto): Promise<BirthdayMan> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.birthdayPeopleService.create(payload.payload);
  }

  @Mutation('updateBirthdayMan')
  async update(@Args() payload: UpdateBirthdayManDto): Promise<BirthdayMan> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.birthdayPeopleService.update(payload.payload);
  }
}
