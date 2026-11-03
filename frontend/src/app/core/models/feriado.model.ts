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

export interface DiaCalendario {
  chave: string;
  dia: number | null;
  data: string | null;
  feriados: Feriado[];
  hoje: boolean;
}