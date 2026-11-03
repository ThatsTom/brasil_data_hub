import { LocalidadesService } from './localidades.service.js';
import { ListarMunicipiosDto } from './dto/listar-municipios.dto.js';
import type { RespostaEstados, RespostaMunicipios } from './localidades.types.js';
export declare class LocalidadesController {
    private readonly localidadesService;
    constructor(localidadesService: LocalidadesService);
    listarEstados(): Promise<RespostaEstados>;
    listarMunicipios(uf: string, filtros: ListarMunicipiosDto): Promise<RespostaMunicipios>;
    pesquisarMunicipios(uf: string, filtros: ListarMunicipiosDto): Promise<RespostaMunicipios>;
}
