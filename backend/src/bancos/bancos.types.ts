export interface Banco {
  codigo: number | null;
  ispb: string;
  nome: string;
  nomeCompleto: string;
  fonte: string;
}

export interface RespostaBancos {
  total: number;
  totalFiltrado: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  atualizadoEm: string;
  cacheDesatualizado: boolean;
  bancos: Banco[];
}