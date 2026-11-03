import { PrismaService } from '../database/prisma.service.js';
import { DashboardFiltrosDto } from './dto/dashboard-filtros.dto.js';
import type { RespostaDashboard } from './dashboard.types.js';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private hojeBrasilia;
    private lerData;
    private somarDias;
    private calcularPeriodo;
    private porcentagem;
    private media;
    obterResumo(filtros: DashboardFiltrosDto): Promise<RespostaDashboard>;
}
