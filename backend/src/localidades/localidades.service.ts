
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service.js';
import { ListarMunicipiosDto } from './dto/listar-municipios.dto.js';

import type {
  Estado,
  Municipio,
  RespostaEstados,
  RespostaMunicipios,
} from './localidades.types.js';

interface IbgeEstado {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

interface IbgeMunicipio {
  id: number;
  nome: string;
  'regiao-imediata'?: {
    nome?: string;
    'regiao-intermediaria'?: {
      nome?: string;
    };
  };
}

interface CacheItem<T> {
  dados: T;
  atualizadoEm: string;
  expiraEm: number;
  desatualizado: boolean;
}

@Injectable()
export class LocalidadesService {
  private readonly logger = new Logger(LocalidadesService.name);

  private readonly baseUrl =
    'https://servicodados.ibge.gov.br/api/v1/localidades';

  private readonly duracaoCache = 24 * 60 * 60 * 1000;

  private cacheEstados?: CacheItem<Estado[]>;

  private readonly cacheMunicipios =
    new Map<string, CacheItem<Municipio[]>>();

  constructor(private readonly prisma: PrismaService) {}

  private normalizar(valor: string): string {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private async requisitar(url: string): Promise<unknown> {
    const resposta = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'BrasilDataHub/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!resposta.ok) {
      throw new Error(
        `IBGE retornou HTTP ${resposta.status}`,
      );
    }

    return resposta.json();
  }

  private async carregarComCache<T>(
    anterior: CacheItem<T> | undefined,
    carregar: () => Promise<T>,
  ): Promise<CacheItem<T>> {
    if (anterior && Date.now() < anterior.expiraEm) {
      return anterior;
    }

    try {
      const dados = await carregar();

      return {
        dados,
        atualizadoEm: new Date().toISOString(),
        expiraEm: Date.now() + this.duracaoCache,
        desatualizado: false,
      };
    } catch (erro) {
      this.logger.warn(
        erro instanceof Error
          ? erro.message
          : 'Falha ao consultar o IBGE',
      );

      if (anterior) {
        return {
          ...anterior,
          expiraEm: Date.now() + 5 * 60 * 1000,
          desatualizado: true,
        };
      }

      throw new ServiceUnavailableException(
        'O serviço de localidades do IBGE está indisponível.',
      );
    }
  }

  private async obterCacheEstados(): Promise<CacheItem<Estado[]>> {
    const resultado = await this.carregarComCache(
      this.cacheEstados,
      async (): Promise<Estado[]> => {
        const resposta = await this.requisitar(
          `${this.baseUrl}/estados?orderBy=nome`,
        );

        if (!Array.isArray(resposta)) {
          throw new Error('Formato inválido de estados.');
        }

        const estados = resposta.filter(
          (item): item is IbgeEstado =>
            item !== null &&
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.sigla === 'string' &&
            typeof item.nome === 'string' &&
            item.regiao !== null &&
            typeof item.regiao === 'object' &&
            typeof item.regiao.id === 'number' &&
            typeof item.regiao.sigla === 'string' &&
            typeof item.regiao.nome === 'string',
        );

        if (!estados.length) {
          throw new Error('Nenhum estado recebido do IBGE.');
        }

        return estados.map((estado) => ({
          id: estado.id,
          sigla: estado.sigla,
          nome: estado.nome,
          regiao: estado.regiao,
        }));
      },
    );

    this.cacheEstados = resultado;
    return resultado;
  }

  async listarEstados(): Promise<RespostaEstados> {
    const cache = await this.obterCacheEstados();

    return {
      estados: cache.dados,
      atualizadoEm: cache.atualizadoEm,
      cacheDesatualizado: cache.desatualizado,
    };
  }

  private async obterCacheMunicipios(
    estado: Estado,
  ): Promise<CacheItem<Municipio[]>> {
    const uf = estado.sigla;
    const anterior = this.cacheMunicipios.get(uf);

    const resultado = await this.carregarComCache(
      anterior,
      async (): Promise<Municipio[]> => {
        const resposta = await this.requisitar(
          `${this.baseUrl}/estados/${estado.id}/municipios?orderBy=nome`,
        );

        if (!Array.isArray(resposta)) {
          throw new Error('Formato inválido de municípios.');
        }

        const municipios = resposta.filter(
          (item): item is IbgeMunicipio =>
            item !== null &&
            typeof item === 'object' &&
            typeof item.id === 'number' &&
            typeof item.nome === 'string',
        );

        if (!municipios.length) {
          throw new Error('Nenhum município recebido.');
        }

        return municipios
          .map((municipio) => ({
            id: municipio.id,
            nome: municipio.nome,
            regiaoImediata:
              municipio['regiao-imediata']?.nome ?? null,
            regiaoIntermediaria:
              municipio['regiao-imediata']
                ? iniciaRegiaoIntermediaria(municipio)
                : null,
          }))
          .sort((a, b) =>
            a.nome.localeCompare(b.nome, 'pt-BR'),
          );

        function iniciaRegiaoIntermediaria(
          municipio: IbgeMunicipio,
        ): string | null {
          return (
            municipio['regiao-imediata']
              ?.['regiao-intermediaria']?.nome ?? null
          );
        }
      },
    );

    this.cacheMunicipios.set(uf, resultado);
    return resultado;
  }

  async listarMunicipios(
    ufInformada: string,
    filtros: ListarMunicipiosDto,
  ): Promise<RespostaMunicipios> {
    const uf = ufInformada.trim().toUpperCase();

    if (!/^[A-Z]{2}$/.test(uf)) {
      throw new BadRequestException('UF inválida.');
    }

    const estados = await this.obterCacheEstados();

    const estado = estados.dados.find(
      (item) => item.sigla === uf,
    );

    if (!estado) {
      throw new NotFoundException('Estado não encontrado.');
    }

    const cache = await this.obterCacheMunicipios(estado);

    const busca = this.normalizar(filtros.busca ?? '');
    const limite = filtros.limite ?? 10;
    const paginaSolicitada = filtros.pagina ?? 1;

    const filtrados = busca
      ? cache.dados.filter((municipio) => {
          return (
            this.normalizar(municipio.nome).includes(busca) ||
            String(municipio.id).includes(busca)
          );
        })
      : cache.dados;

    const totalFiltrado = filtrados.length;
    const totalPaginas = Math.max(
      1,
      Math.ceil(totalFiltrado / limite),
    );

    const pagina = Math.min(
      paginaSolicitada,
      totalPaginas,
    );

    const inicio = (pagina - 1) * limite;

    return {
      estado,
      total: cache.dados.length,
      totalFiltrado,
      pagina,
      limite,
      totalPaginas,
      atualizadoEm: cache.atualizadoEm,
      cacheDesatualizado:
        cache.desatualizado || estados.desatualizado,
      municipios: filtrados.slice(inicio, inicio + limite),
    };
  }

  async pesquisarMunicipios(
    uf: string,
    filtros: ListarMunicipiosDto,
  ): Promise<RespostaMunicipios> {
    const termo = filtros.busca?.trim() ?? '';

    if (!termo) {
      return this.listarMunicipios(uf, filtros);
    }

    const inicio = Date.now();
    let status = 'INDISPONIVEL';

    try {
      const resultado = await this.listarMunicipios(uf, filtros);

      status =
        resultado.totalFiltrado > 0
          ? 'SUCESSO'
          : 'NAO_ENCONTRADO';

      return resultado;
    } finally {
      await this.prisma.consulta.create({
        data: {
          tipo: 'MUNICIPIO',
          termo: `${uf.toUpperCase()}: ${termo}`,
          status,
          fonte: 'IBGE',
          tempoMs: Date.now() - inicio,
        },
      });
    }
  }
}
