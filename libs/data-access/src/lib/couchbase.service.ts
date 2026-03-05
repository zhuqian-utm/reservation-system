import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as couchbase from 'couchbase';
import { AppConfigService } from '@reservation-system/shared';

@Injectable()
export class CouchbaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CouchbaseService.name);
  private cluster!: couchbase.Cluster;
  private bucket!: couchbase.Bucket;
  private collection!: couchbase.Collection;

  private readonly connectionString?: string;
  private readonly username?: string;
  private readonly password?: string;
  private readonly bucketName?: string;

  constructor(private appConfig: AppConfigService) {
    const { connectionString, username, password, bucketName } =
      this.appConfig.couchbaseConfig;

    this.connectionString = connectionString;
    this.username = username;
    this.password = password;
    this.bucketName = bucketName;
  }

  async onModuleInit() {
    if (
      !this.connectionString ||
      !this.username ||
      !this.password ||
      !this.bucketName
    ) {
      throw new Error(
        'Critical Error: Couchbase environment variables are missing!',
      );
    }
    try {
      this.logger.log('connect to Couchbase: ', this.connectionString);
      this.cluster = await couchbase.connect(this.connectionString, {
        username: this.username,
        password: this.password,
        timeouts: {
          kvTimeout: 10000, // 10 seconds for data operations
          connectTimeout: 20000, // 20 seconds for the initial handshake
        },
      });

      this.bucket = this.cluster.bucket(this.bucketName);
      this.collection = this.bucket.defaultCollection();

      this.logger.log(
        `Successfully connected to Couchbase bucket: ${this.bucketName}`,
      );

      await this.createIndexes();
    } catch (error) {
      this.logger.error(
        'Failed to connect to Couchbase',
        this.connectionString,
        error,
      );
      throw error;
    }
  }

  // Getter for the collection to be used by Repositories
  getCollection(): couchbase.Collection {
    return this.collection;
  }

  // Getter for the cluster to run N1QL (SQL++ ) queries
  getCluster(): couchbase.Cluster {
    return this.cluster;
  }

  async onModuleDestroy() {
    await this.cluster.close();
    this.logger.log('Couchbase connection closed.');
  }

  private async createIndexes() {
    const indexes = [
      `CREATE INDEX idx_reservations_date ON \`${this.bucketName}\`(DATE(arrivalTime), status) IF NOT EXISTS`,
      `CREATE INDEX idx_reservations_guest ON \`${this.bucketName}\`(guestId) IF NOT EXISTS`,
      `CREATE INDEX idx_reservations_status ON \`${this.bucketName}\`(status) IF NOT EXISTS`,
    ];

    for (const query of indexes) {
      try {
        await this.cluster.query(query);
        this.logger.log(`Ensured index: ${query.split(' ')[2]}`);
      } catch (err) {
        this.logger.error(`Index creation failed`, err);
      }
    }

    this.logger.log('Index check complete.');
  }
}
