import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

import { DATABASE_CONFIG } from './database.constant';
import { Database } from './database.interface';

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
      throw error;
    }
  }

  async query(query: string, values: any[] = []): Promise<any[]> {
    try {
      return (await this.pool.query(query, values)).rows;
    } catch (error) {
      throw error;
    }
  }
}
