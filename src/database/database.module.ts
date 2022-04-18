import { Module, DynamicModule, Global } from '@nestjs/common';

import { DatabaseService } from './database.service';
import { DATABASE_CONFIG } from './constants';
import { Database } from './interfaces';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(config: Database): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_CONFIG,
          useValue: config,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
