import { PrismaService } from '../database/prisma.service.js';
import type { RespostaFeriados } from './feriados.types.js';
export declare class FeriadosService {
    private readonly prisma;
    private readonly logger;
    private readonly baseUrl;
    private readonly duracaoCache;
    private readonly cache;
    private readonly carregamentos;
    constructor(prisma: PrismaService);
    private validarAno;
    private buscarNaBrasilApi;
    private obterCache;
    listar(ano: number): Promise<RespostaFeriados>;
    consultar(ano: number): Promise<RespostaFeriados>;
}
