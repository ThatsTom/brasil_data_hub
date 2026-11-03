import { DashboardService } from './dashboard.service.js';
import { DashboardFiltrosDto } from './dto/dashboard-filtros.dto.js';
import type { RespostaDashboard } from './dashboard.types.js';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    obterResumo(filtros: DashboardFiltrosDto): Promise<RespostaDashboard>;
}
