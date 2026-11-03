export interface Feriado {
    data: string;
    nome: string;
    tipo: string;
}
export interface RespostaFeriados {
    ano: number;
    total: number;
    atualizadoEm: string;
    cacheDesatualizado: boolean;
    fonte: string;
    feriados: Feriado[];
}
