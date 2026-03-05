import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as couchbase from 'couchbase';
import { AppConfigService } from '@reservation-system/shared';

@Injectable()
export class CouchbaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CouchbaseService.name);
  private cluster!: couchbase.Cluster;
  private bucket!: couchbase.Bucket;
  private collection!: couchbase.Collection;

  private connectionString: string = '';
  private username: string = '';
  private password: string = '';
  private bucketName: string = '';

  constructor(private appConfig: AppConfigService) {
    this.validateAndLoadConfig();
  }

  async onModuleInit() {
    this.logger.log(
      `Connecting to Couchbase: ${this.connectionString} - ${this.bucketName}`,
    );

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
      `CREATE INDEX idx_reservations_date IF NOT EXISTS ON \`${this.bucketName}\`(SUBSTR(arrivalTime, 0, 10), status)`,
      `CREATE INDEX idx_reservations_guest IF NOT EXISTS ON \`${this.bucketName}\`(guestId)`,
      `CREATE INDEX idx_reservations_status IF NOT EXISTS ON \`${this.bucketName}\`(status)`,
    ];

    for (const query of indexes) {
      try {
        await this.cluster.query(query);
        const indexName = query.split(' ')[2];
        this.logger.log(`Ensured index: ${indexName}`);
      } catch (err) {
        this.logger.error(`Index creation failed`, err);
      }
    }

    this.logger.log('Index check complete.');
  }

  private validateAndLoadConfig() {
    const config = this.appConfig.couchbaseConfig;
    const missingVars: string[] = [];

    if (!config.connectionString) missingVars.push('COUCHBASE_URL');
    if (!config.username) missingVars.push('COUCHBASE_USER');
    if (!config.password) missingVars.push('COUCHBASE_PASS');
    if (!config.bucketName) missingVars.push('COUCHBASE_BUCKET');

    if (missingVars.length > 0) {
      const errorMsg = `Couchbase Initialization Failed. Missing variables: [${missingVars.join(', ')}]`;
      this.logger.error(errorMsg);
      throw new NotFoundException(errorMsg);
    }

    this.connectionString = config.connectionString;
    this.username = config.username;
    this.password = config.password;
    this.bucketName = config.bucketName;
  }
}
