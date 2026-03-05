import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

@Global() // Makes it available everywhere without re-importing
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
