import { PrismaService } from '../database/prisma.service.js';
export interface EnderecoCep {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
    fonte: string;
}
export declare class CepService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    consultar(entrada: string): Promise<EnderecoCep>;
    private requisitar;
    private buscarBrasilApi;
    private buscarViaCep;
}
