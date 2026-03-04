import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import * as couchbase from 'couchbase';

@Injectable()
export class CouchbaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CouchbaseService.name);
  private cluster!: couchbase.Cluster;
  private bucket!: couchbase.Bucket;
  private collection!: couchbase.Collection;

  // These should ideally come from environment variables for Production/Cloud
  private readonly connectionString =
    process.env['COUCHBASE_URL'] || 'couchbase://localhost';
  private readonly username = process.env['COUCHBASE_USER'] || 'admin';
  private readonly password = process.env['COUCHBASE_PASS'] || '000000';
  private readonly bucketName =
    process.env['COUCHBASE_BUCKET'] || 'hilton_reservations';

  async onModuleInit() {
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
}
