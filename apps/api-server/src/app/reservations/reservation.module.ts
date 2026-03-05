import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ReservationResolver } from './reservation.resolver';
import { AuthModule } from '../auth/auth.module';
import { DataAccessModule } from '../data-access.module';
import { AppConfigModule, AppConfigService } from '@reservation-system/shared';

@Module({
  imports: [
    // Import AuthModule to use JwtAuthGuard and RolesGuard logic
    AuthModule,
    // Import DataAccessModule to access the ReservationRepository
    DataAccessModule,
    // Import Cache Module
    CacheModule.register({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        ttl: config.cacheTtl,
        max: config.cacheMaxItems,
      }),
    }),
  ],
  providers: [ReservationResolver],
})
export class ReservationModule {}
