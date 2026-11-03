export interface Consulta {
  id: string;
  tipo: string;
  termo: string;
  status: string;
  fonte: string | null;
  tempoMs: number | null;
  criadoEm: string;
}

export interface FiltrosConsultas {
  pagina: number;
  limite: number;
  busca: string;
  tipo: string;
  status: string;
  dataInicio: string;
  dataFim: string;
}

export interface ConsultasResponse {
  total: number;
  totalFiltrado: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  indicadores: {
    sucesso: number;
    tempoMedio: number;
  };
  consultas: Consulta[];
}