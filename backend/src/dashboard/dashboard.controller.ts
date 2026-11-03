import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service.js';
import { DashboardFiltrosDto } from './dto/dashboard-filtros.dto.js';

import type {
  RespostaDashboard,
} from './dashboard.types.js';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  obterResumo(
    @Query() filtros: DashboardFiltrosDto,
  ): Promise<RespostaDashboard> {
    return this.dashboardService.obterResumo(filtros);
  }
}