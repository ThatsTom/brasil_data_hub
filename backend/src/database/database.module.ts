import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { DatabaseController } from './database.controller.js';

@Module({
  controllers: [DatabaseController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}