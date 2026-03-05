import { Injectable } from '@nestjs/common';
import { CouchbaseService } from '../couchbase.service';
import { IReservation } from '../models/reservation.model';

@Injectable()
export class ReservationRepository {
  constructor(private readonly db: CouchbaseService) {}

  async save(reservation: IReservation): Promise<void> {
    const collection = this.db.getCollection();
    // Use the ID as the Document Key
    await collection.upsert(reservation.id, reservation);
  }

  async findById(id: string): Promise<IReservation> {
    const result = await this.db.getCollection().get(id);
    return result.content as IReservation;
  }

  async findAllByGuestId(guestId: string): Promise<IReservation[]> {
    const query = `
      SELECT h.* FROM \`hilton_reservations\` h 
      WHERE h.guestId = $1
    `;
    const options = { parameters: [guestId] };
    const result = await this.db.getCluster().query(query, options);
    return result.rows;
  }

  async findAllByDate(date: string): Promise<IReservation[]> {
    const query = `
      SELECT h.* FROM \`hilton_reservations\` h
      WHERE DATE(h.arrivalTime) = DATE($1)
      ORDER BY h.arrivalTime ASC
    `;
    const options = { parameters: [date] };
    const result = await this.db.getCluster().query(query, options);
    return result.rows;
  }
}
