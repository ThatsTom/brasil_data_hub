import { PrismaService } from '../database/prisma.service.js';
import { ListarMunicipiosDto } from './dto/listar-municipios.dto.js';
import type { RespostaEstados, RespostaMunicipios } from './localidades.types.js';
export declare class LocalidadesService {
    private readonly prisma;
    private readonly logger;
    private readonly baseUrl;
    private readonly duracaoCache;
    private cacheEstados?;
    private readonly cacheMunicipios;
    constructor(prisma: PrismaService);
    private normalizar;
    private requisitar;
    private carregarComCache;
    private obterCacheEstados;
    listarEstados(): Promise<RespostaEstados>;
    private obterCacheMunicipios;
    listarMunicipios(ufInformada: string, filtros: ListarMunicipiosDto): Promise<RespostaMunicipios>;
    pesquisarMunicipios(uf: string, filtros: ListarMunicipiosDto): Promise<RespostaMunicipios>;
}
