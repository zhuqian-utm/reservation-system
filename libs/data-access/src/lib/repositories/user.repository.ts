import { Injectable, Logger } from '@nestjs/common';
import { CouchbaseService } from '../couchbase.service';
import { IUser } from '../models/user.model';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);
  private readonly bucketName = 'hilton_reservations';

  constructor(private readonly db: CouchbaseService) {}

  /**
   * Used during Login to find the user by their email/username.
   * Requirement: Clean Architecture (Separation of concerns)
   */
  async findByUsername(username: string): Promise<IUser | null> {
    try {
      const query = `
        SELECT h.* FROM \`${this.bucketName}\` h 
        WHERE h.username = $1 AND h.type = "user"
      `;
      const options = { parameters: [username] };
      const result = await this.db.getCluster().query(query, options);
      
      return result.rows.length > 0 ? (result.rows[0] as IUser) : null;
    } catch (error) {
      this.logger.error(`Error finding user: ${username}`, error);
      throw error;
    }
  }

  /**
   * Used during Registration to save a new Guest.
   * Requirement: NoSQL Persistence
   */
  async create(user: IUser): Promise<void> {
    const collection = this.db.getCollection();
    // We add a "type" field to differentiate documents in the same bucket
    const doc = { ...user, type: 'user' };
    await collection.insert(user.id, doc);
  }

  async exists(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return !!user;
  }
}
