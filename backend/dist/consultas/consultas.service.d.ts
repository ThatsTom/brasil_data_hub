import { PrismaService } from '../database/prisma.service.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';
export declare class ConsultasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private converterDataLocal;
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
            tempoMs: number | null;
            id: string;
            tipo: string;
            termo: string;
            status: string;
            fonte: string | null;
            criadoEm: Date;
        }[];
    }>;
}
