import { Module } from '@nestjs/common';
import { ReservationResolver } from './reservation.resolver';
import { AuthModule } from '../auth/auth.module';
import { DataAccessModule } from '../data-access.module';

@Module({
  imports: [
    // Import AuthModule to use JwtAuthGuard and RolesGuard logic
    AuthModule, 
    // Import DataAccessModule to access the ReservationRepository
    DataAccessModule,
  ],
  providers: [ReservationResolver],
})
export class ReservationModule {}
