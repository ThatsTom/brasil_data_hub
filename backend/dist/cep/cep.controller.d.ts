import { CepService } from './cep.service.js';
export declare class CepController {
    private readonly cepService;
    constructor(cepService: CepService);
    consultar(cep: string): Promise<import("./cep.service.js").EnderecoCep>;
}
