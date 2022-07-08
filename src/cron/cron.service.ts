import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    console.log(12);
  }
}
