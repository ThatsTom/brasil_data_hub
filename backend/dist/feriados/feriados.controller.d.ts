import { FeriadosService } from './feriados.service.js';
import type { RespostaFeriados } from './feriados.types.js';
export declare class FeriadosController {
    private readonly feriadosService;
    constructor(feriadosService: FeriadosService);
    listar(ano: number): Promise<RespostaFeriados>;
    consultar(ano: number): Promise<RespostaFeriados>;
}
