import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { DatabaseService } from '@database/database.service';
import { MailService } from '@mail/mail.service';
import { getNotificationList } from './notification.repository';
import { getNotificationHTMLTemplate } from './templates';

@Injectable()
export class NotificationService {
  constructor(
    private databaseService: DatabaseService,
    private mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleNotify() {
    try {
      const month = new Date().getMonth() + 1;
      const day = new Date().getDate();

      const birthdayPeopleBeforeDay = await this.databaseService.query(
        getNotificationList,
        [month, day + 1],
      );
      const birthdayPeople = await this.databaseService.query(
        getNotificationList,
        [month, day],
      );

      birthdayPeopleBeforeDay.forEach((item) => {
        this.mailService.sendMail({
          from: process.env.MAIL_USER,
          to: item.email,
          subject: 'BIRTHDAY',
          html: getNotificationHTMLTemplate({
            rememberDay: 'Tomorrow',
            firstName: item.first_name,
            lastName: item.last_name,
            birthDate: new Date(item.birth_date).toJSON().slice(0, 10),
            years: item.years,
          }),
        });
      });
      birthdayPeople.forEach((item) => {
        this.mailService.sendMail({
          from: process.env.MAIL_USER,
          to: item.email,
          subject: 'BIRTHDAY',
          html: getNotificationHTMLTemplate({
            rememberDay: 'Today',
            firstName: item.first_name,
            lastName: item.last_name,
            birthDate: new Date(item.birth_date).toJSON().slice(0, 10),
            years: item.years,
          }),
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
