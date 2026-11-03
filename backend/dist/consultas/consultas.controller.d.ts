import { ConsultasService } from './consultas.service.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';
export declare class ConsultasController {
    private readonly consultasService;
    constructor(consultasService: ConsultasService);
    listar(filtros: ListarConsultasDto): Promise<{
        total: number;
        totalFiltrado: number;
        pagina: number;
        limite: number;
        totalPaginas: number;
        indicadores: {
            sucesso: number;
            tempoMedio: number;
        };
        consultas: {
            id: string;
            tipo: string;
            termo: string;
            status: string;
            fonte: string | null;
            tempoMs: number | null;
            criadoEm: Date;
        }[];
    }>;
}
