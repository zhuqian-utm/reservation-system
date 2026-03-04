import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservations/reservation.module';
import { DataAccessModule } from './data-access.module';

@Module({
  imports: [
    DataAccessModule,
    AuthModule,
    ReservationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/api-server/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
  ],
})
export class AppModule {}
