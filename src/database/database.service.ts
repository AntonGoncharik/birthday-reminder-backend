import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

import { DATABASE_CONFIG } from './constant';
import { Database } from './interface';

@Injectable()
export class DatabaseService {
  private pool: Pool;

  constructor(@Inject(DATABASE_CONFIG) private config: Database) {
    this.connect(config);
  }

  async connect(config: Database): Promise<void> {
    try {
      this.pool = new Pool({
        host: config.host,
        port: config.port,
        user: config.user,
        database: config.database,
        password: config.password,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async query(queryString: string, params: string[] = []): Promise<any> {
    try {
      return (await this.pool.query(queryString, [...params])).rows;
    } catch (error) {
      throw error;
    }
  }
}
