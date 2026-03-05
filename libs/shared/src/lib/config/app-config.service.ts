import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CouchbaseConfig {
  connectionString: string;
  username: string;
  password: string;
  bucketName: string;
}

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get corsOrigins(): string[] {
    return this.configService.get<string>('CORS_ORIGINS')?.split(',') || [];
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }

  get couchbaseConfig(): CouchbaseConfig {
    return {
      connectionString: this.configService.get<string>('COUCHBASE_URL') || '',
      username: this.configService.get<string>('COUCHBASE_USER') || '',
      password: this.configService.get<string>('COUCHBASE_PASS') || '',
      bucketName: this.configService.get<string>('COUCHBASE_BUCKET') || '',
    };
  }

  get employeeRegistrationCode(): string {
    return this.configService.get<string>('EMPLOYEE_REGISTRATION_CODE') || '';
  }

  get cacheTtl(): number {
    // If CACHE_TTL isn't in .env, default to 300 seconds (5 mins)
    return this.configService.get<number>('CACHE_TTL', 300);
  }

  get cacheMaxItems(): number {
    // If CACHE_MAX_ITEMS isn't in .env, default to 100 items
    return this.configService.get<number>('CACHE_MAX_ITEMS', 100);
  }
}
