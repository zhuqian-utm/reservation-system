import { Module, Global } from '@nestjs/common';
import { 
  CouchbaseService, 
  UserRepository, 
  ReservationRepository 
} from '@reservation-system/data-access/server';

@Global() // Makes these repositories available everywhere without re-importing
@Module({
  providers: [
    CouchbaseService,
    UserRepository,
    ReservationRepository,
  ],
  exports: [
    CouchbaseService,
    UserRepository,
    ReservationRepository,
  ],
})
export class DataAccessModule {}
