export declare class ListarConsultasDto {
    pagina: number;
    limite: number;
    busca?: string;
    tipo?: string;
    status?: 'SUCESSO' | 'NAO_ENCONTRADO' | 'INDISPONIVEL';
    dataInicio?: string;
    dataFim?: string;
}
