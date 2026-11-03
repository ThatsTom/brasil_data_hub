export interface DashboardFiltros {
  periodo?: 7 | 30 | 90;
  inicio?: string;
  fim?: string;
  tipo?: string;
}

export interface DiaDashboard {
  data: string;
  total: number;
  sucesso: number;
  naoEncontrado: number;
  indisponivel: number;
}

export interface ModuloDashboard {
  tipo: string;
  total: number;
  sucesso: number;
  taxaSucesso: number;
  tempoMedio: number | null;
}

export interface FonteDashboard {
  fonte: string;
  total: number;
  sucesso: number;
  taxaSucesso: number;
  tempoMedio: number | null;
}

export interface ConsultaDashboard {
  id: string;
  tipo: string;
  termo: string;
  status: string;
  fonte: string | null;
  tempoMs: number | null;
  criadoEm: string;
}

export interface DashboardResposta {
  filtros: {
    inicio: string;
    fim: string;
    tipo: string | null;
  };

  indicadores: {
    total: number;
    sucesso: number;
    naoEncontrado: number;
    indisponivel: number;
    taxaSucesso: number;
    tempoMedio: number | null;
    periodoAnterior: number;
    variacaoPercentual: number | null;
  };

  serieDiaria: DiaDashboard[];

  porModulo: ModuloDashboard[];

  porStatus: Array<{
    status: string;
    total: number;
  }>;

  porFonte: FonteDashboard[];

  maisPesquisados: Array<{
    tipo: string;
    termo: string;
    total: number;
  }>;

  recentes: ConsultaDashboard[];
}