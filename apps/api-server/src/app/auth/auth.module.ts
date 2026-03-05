import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { DataAccessModule } from '../data-access.module';
import { AppConfigModule, AppConfigService } from '@reservation-system/shared';

@Module({
  imports: [
    PassportModule,
    // Configuration for JWT
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        secret: appConfig.jwtSecret,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    // This allows AuthModule to use the UserRepository from your shared lib
    DataAccessModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Exported so other modules can use it for guards
})
export class AuthModule {}
