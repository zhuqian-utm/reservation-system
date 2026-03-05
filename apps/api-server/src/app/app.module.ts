import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { AuditInterceptor } from '@reservation-system/shared';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservations/reservation.module';
import { DataAccessModule } from './data-access.module';
import { GqlThrottlerGuard } from './auth/guards/gql-throttle.guard';

@Module({
  imports: [
    DataAccessModule,
    AuthModule,
    ReservationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? true
          : join(process.cwd(), 'apps/api-server/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
