import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { PRODUCTION, API_URI } from '@common/constants';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@api/auth/auth.module';
import { UsersModule } from '@api/users/users.module';
import { JwtAuthGuard } from '@api/auth/guards';
import { BirthdayPeopleModule } from '@api/birthday-people/birthday-people.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    DatabaseModule.forRoot({
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: API_URI,
      typePaths: ['./**/*.graphql'],
      playground: process.env.NODE_ENV !== PRODUCTION,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },
    }),
    AuthModule,
    UsersModule,
    BirthdayPeopleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
