
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service.js';

import type {
  Feriado,
  RespostaFeriados,
} from './feriados.types.js';

interface FeriadoExterno {
  date: string;
  name: string;
  type?: string;
}

interface CacheFeriados {
  feriados: Feriado[];
  atualizadoEm: string;
  expiraEm: number;
  desatualizado: boolean;
}

@Injectable()
export class FeriadosService {
  private readonly logger = new Logger(FeriadosService.name);

  private readonly baseUrl =
    'https://brasilapi.com.br/api/feriados/v1';

  private readonly duracaoCache = 24 * 60 * 60 * 1000;

  private readonly cache = new Map<number, CacheFeriados>();

  private readonly carregamentos =
    new Map<number, Promise<CacheFeriados>>();

  constructor(private readonly prisma: PrismaService) {}

  private validarAno(ano: number): void {
    if (
      !Number.isInteger(ano) ||
      ano < 1900 ||
      ano > 2199
    ) {
      throw new BadRequestException(
        'Informe um ano entre 1900 e 2199.',
      );
    }
  }

  private async buscarNaBrasilApi(
    ano: number,
  ): Promise<Feriado[]> {
    const resposta = await fetch(
      `${this.baseUrl}/${ano}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'BrasilDataHub/1.0',
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (resposta.status === 429) {
      throw new HttpException(
        'Limite de consultas da BrasilAPI atingido.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (!resposta.ok) {
      throw new Error(
        `BrasilAPI retornou HTTP ${resposta.status}`,
      );
    }

    const dados: unknown = await resposta.json();

    if (!Array.isArray(dados)) {
      throw new Error(
        'A BrasilAPI retornou um formato inválido.',
      );
    }

    const feriados: Feriado[] = dados
      .filter(
        (item: unknown): item is FeriadoExterno =>
          item !== null &&
          typeof item === 'object' &&
          'date' in item &&
          'name' in item &&
          typeof item.date === 'string' &&
          typeof item.name === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
          item.date.startsWith(`${ano}-`),
      )
      .map((item) => ({
        data: item.date,
        nome: item.name,
        tipo: typeof item.type === 'string'
          ? item.type
          : 'nao_informado',
      }))
      .sort((a, b) =>
        a.data.localeCompare(b.data),
      );

    if (feriados.length === 0) {
      throw new Error(
        'Nenhuma data válida foi retornada pela BrasilAPI.',
      );
    }

    return feriados;
  }

  private async obterCache(ano: number): Promise<CacheFeriados> {
    this.validarAno(ano);

    const anterior = this.cache.get(ano);

    if (anterior && Date.now() < anterior.expiraEm) {
      return anterior;
    }

    const carregamentoExistente = this.carregamentos.get(ano);

    if (carregamentoExistente) {
      return carregamentoExistente;
    }

    const carregamento = this.buscarNaBrasilApi(ano)
      .then((feriados): CacheFeriados => {
        const resultado: CacheFeriados = {
          feriados,
          atualizadoEm: new Date().toISOString(),
          expiraEm: Date.now() + this.duracaoCache,
          desatualizado: false,
        };

        this.cache.set(ano, resultado);

        this.logger.log(
          `${feriados.length} datas carregadas para ${ano}.`,
        );

        return resultado;
      })
      .catch((erro: unknown): CacheFeriados => {
        this.logger.warn(
          erro instanceof Error
            ? erro.message
            : 'Falha desconhecida ao consultar feriados.',
        );

        if (anterior) {
          const recuperado: CacheFeriados = {
            ...anterior,
            expiraEm: Date.now() + 5 * 60 * 1000,
            desatualizado: true,
          };

          this.cache.set(ano, recuperado);

          return recuperado;
        }

        if (erro instanceof HttpException) {
          throw erro;
        }

        throw new ServiceUnavailableException(
          'O serviço de feriados está temporariamente indisponível.',
        );
      })
      .finally(() => {
        this.carregamentos.delete(ano);
      });

    this.carregamentos.set(ano, carregamento);

    return carregamento;
  }

  async listar(ano: number): Promise<RespostaFeriados> {
    const resultado = await this.obterCache(ano);

    return {
      ano,
      total: resultado.feriados.length,
      atualizadoEm: resultado.atualizadoEm,
      cacheDesatualizado: resultado.desatualizado,
      fonte: 'BrasilAPI',
      feriados: resultado.feriados,
    };
  }

  async consultar(ano: number): Promise<RespostaFeriados> {
    this.validarAno(ano);

    const inicio = Date.now();
    let status = 'INDISPONIVEL';

    try {
      const resultado = await this.listar(ano);

      status = 'SUCESSO';

      return resultado;
    } finally {
      await this.prisma.consulta.create({
        data: {
          tipo: 'FERIADO',
          termo: String(ano),
          status,
          fonte: 'BrasilAPI',
          tempoMs: Date.now() - inicio,
        },
      });
    }
  }
}
