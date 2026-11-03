import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Controller('health')
export class DatabaseController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('database')
  async checkDatabase() {
    const total = await this.prisma.consulta.count();

    return {
      status: 'online',
      database: 'PostgreSQL',
      totalConsultas: total,
    };
  }
}