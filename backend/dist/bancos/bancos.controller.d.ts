import { BancosService } from './bancos.service.js';
import { ListarBancosDto } from './dto/listar-bancos.dto.js';
import type { Banco, RespostaBancos } from './bancos.types.js';
export declare class BancosController {
    private readonly bancosService;
    constructor(bancosService: BancosService);
    listar(filtros: ListarBancosDto): Promise<RespostaBancos>;
    pesquisar(filtros: ListarBancosDto): Promise<RespostaBancos>;
    obter(codigo: number): Promise<Banco>;
}
