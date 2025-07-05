import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './users.repository';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
