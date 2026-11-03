import { CnpjService } from './cnpj.service.js';
import type { EmpresaCnpj } from './cnpj.types.js';
export declare class CnpjController {
    private readonly cnpjService;
    constructor(cnpjService: CnpjService);
    consultar(cnpj: string): Promise<EmpresaCnpj>;
}
