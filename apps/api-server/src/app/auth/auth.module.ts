import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { DataAccessModule } from '../data-access.module';

@Module({
  imports: [
    PassportModule,
    // Configuration for JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'HILTON_SECRET_KEY_2026', 
      signOptions: { expiresIn: '1d' },
    }),
    // This allows AuthModule to use the UserRepository from your shared lib
    DataAccessModule, 
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Exported so other modules can use it for guards
})
export class AuthModule {}
