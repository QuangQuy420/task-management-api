import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(body: LoginDto): Promise<User | null> {
    const { email, password } = body;
    const user = await this.usersService.findByEmail(email);
    // eslint-disable-next-line
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User, res: Response) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      access_token: accessToken,
    };
  }

  async register(email: string, password: string) {
    if (await this.usersService.findByEmail(email)) {
      throw new UnauthorizedException('User already exists');
    }
    // eslint-disable-next-line
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser({
      email,
      password: hashedPassword as string,
    });
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      // eslint-disable-next-line
      const payload = this.jwtService.verify(refreshToken) as { email: string; sub: UUID };
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: '15m' },
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token',
        error as string,
      );
    }
  }

  logout(res: Response) {
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out successfully' };
  }
}
