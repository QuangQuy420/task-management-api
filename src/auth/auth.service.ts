import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    // eslint-disable-next-line
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
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
}
