import { PrismaService } from '../database/prisma.service.js';
import type { EmpresaCnpj } from './cnpj.types.js';
export declare class CnpjService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private calcularDigito;
    private validarCnpj;
    private mapearEmpresa;
    consultar(entrada: string): Promise<EmpresaCnpj>;
}
