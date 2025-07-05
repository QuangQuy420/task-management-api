import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: { email: string; password: string }) {
    return this.userRepository.createUser(data);
  }
}
