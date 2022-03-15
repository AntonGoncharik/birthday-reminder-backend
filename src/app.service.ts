import { Injectable } from '@nestjs/common';

import { DatabaseService } from '@database/database.service';

@Injectable()
export class AppService {
  constructor(private databaseService: DatabaseService) {
    this.a();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async a() {
    const res = await this.databaseService.query('SELECT * FROM users');
    console.log(res);
  }
}
