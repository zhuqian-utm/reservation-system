import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@reservation-system/data-access/server';
import { IUser, UserRole } from '@reservation-system/data-access';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Requirement: RESTful Endpoints for authentication services
   * Handles new Guest sign-ups for the Hilton system.
   */
  async register(
    username: string,
    password: string,
    fullName: string,
    phone: string,
    code: string,
  ) {
    const userExists = await this.userRepository.exists(username);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: IUser = {
      id: uuidv4(),
      username,
      passwordHash,
      role: code === 'Hilton2026' ? UserRole.EMPLOYEE : UserRole.GUEST,
      fullName,
      contactInfo: {
        email: username,
        phone,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.userRepository.create(newUser);
    return this.login(newUser);
  }

  /**
   * Validates credentials and returns a JWT.
   * Requirement: Clean Architecture & Logging properly.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
      },
    };
  }
}
