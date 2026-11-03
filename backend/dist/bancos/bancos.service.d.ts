import { PrismaService } from '../database/prisma.service.js';
import { ListarBancosDto } from './dto/listar-bancos.dto.js';
import type { Banco, RespostaBancos } from './bancos.types.js';
export declare class BancosService {
    private readonly prisma;
    private readonly logger;
    private readonly tempoCache;
    private cache;
    private carregamento;
    constructor(prisma: PrismaService);
    private normalizarTexto;
    private atualizarCatalogo;
    private obterCatalogo;
    listar(filtros: ListarBancosDto): Promise<RespostaBancos>;
    pesquisar(filtros: ListarBancosDto): Promise<RespostaBancos>;
    obterPorCodigo(codigo: number): Promise<Banco>;
}
