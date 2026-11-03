export interface Estado {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export interface Municipio {
  id: number;
  nome: string;
  regiaoImediata: string | null;
  regiaoIntermediaria: string | null;
}

export interface RespostaEstados {
  estados: Estado[];
  atualizadoEm: string;
  cacheDesatualizado: boolean;
}

export interface FiltrosMunicipios {
  busca: string;
  pagina: number;
  limite: number;
}

export interface RespostaMunicipios {
  estado: Estado;
  total: number;
  totalFiltrado: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  atualizadoEm: string;
  cacheDesatualizado: boolean;
  municipios: Municipio[];
}