import { User } from "generated/prisma";

export class BaseService {
  constructor(private readonly repository: any) {}

  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async create(data: any): Promise<User> {
    return this.repository.create(data);
  }

  async update(id: string, data: any): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
