import { Module } from '@nestjs/common';

import { BirthdayPeopleService } from './birthday-people.service';
import { BirthdayPeopleResolver } from './birthday-people.resolver';

@Module({
  providers: [BirthdayPeopleService, BirthdayPeopleResolver],
  exports: [BirthdayPeopleService],
})
export class BirthdayPeopleModule {}
