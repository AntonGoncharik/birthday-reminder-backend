import { Module, DynamicModule, Global } from '@nestjs/common';

import { DatabaseService } from './database.service';
import { DATABASE_CONFIG } from './constant';
import { Database } from './interface';

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
