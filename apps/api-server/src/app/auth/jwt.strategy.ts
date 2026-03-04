import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '@reservation-system/data-access/server';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepo: UserRepository) {
    super({
      // 1. Grab the token from the 'Authorization: Bearer <token>' header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Must match the secret used in AuthModule
      secretOrKey: process.env.JWT_SECRET || 'HILTON_SECRET_KEY_2026',
    });
  }

  async validate(payload: any) {
  // Try finding by the sub (ID) first using a direct KV get
  let user = await this.userRepo.findByUsername(payload.username);

  if (!user) {
    throw new UnauthorizedException('User session valid, but profile not found');
  }

  return { 
    userId: user.id, 
    email: user.username, // or user.email depending on your model
    role: user.role 
  };
}
}