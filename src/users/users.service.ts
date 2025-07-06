import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { BaseService } from 'src/common/baseService';

@Injectable()
export class UsersService extends BaseService {
  constructor(private userRepository: UserRepository) {
    super(userRepository);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: { email: string; password: string }) {
    return this.userRepository.createUser(data);
  }
}
