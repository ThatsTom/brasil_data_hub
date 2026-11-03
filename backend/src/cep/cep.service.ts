
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';

export interface EnderecoCep {
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  fonte: string;
}

interface BrasilApiResponse {
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

type Resultado<T> =
  | { status: 'ok'; data: T }
  | { status: 'nao_encontrado' }
  | { status: 'indisponivel' };

type ResultadoCep =
  | { status: 'ok'; data: EnderecoCep }
  | { status: 'nao_encontrado' }
  | { status: 'indisponivel' };

@Injectable()
export class CepService {
  constructor(private readonly prisma: PrismaService) {}

  async consultar(entrada: string): Promise<EnderecoCep> {
    const valor = entrada.trim();

    if (!/^\d{5}-?\d{3}$/.test(valor)) {
      throw new BadRequestException('Informe um CEP válido com 8 dígitos.');
    }

    const cep = valor.replace('-', '');
    const inicio = Date.now();

    const brasilApi = await this.buscarBrasilApi(cep);

    const resultado =
      brasilApi.status === 'ok'
        ? brasilApi
        : await this.buscarViaCep(cep);

    const status =
      resultado.status === 'ok'
        ? 'SUCESSO'
        : brasilApi.status === 'nao_encontrado' &&
            resultado.status === 'nao_encontrado'
          ? 'NAO_ENCONTRADO'
          : 'INDISPONIVEL';

    await this.prisma.consulta.create({
      data: {
        tipo: 'CEP',
        termo: cep,
        status,
        fonte: resultado.status === 'ok'
          ? resultado.data.fonte
          : null,
        tempoMs: Date.now() - inicio,
      },
    });

    if (resultado.status === 'ok') {
      return resultado.data;
    }

    if (status === 'NAO_ENCONTRADO') {
      throw new NotFoundException('CEP não encontrado.');
    }

    throw new ServiceUnavailableException(
      'Os serviços de consulta estão temporariamente indisponíveis.',
    );
  }

  private async requisitar<T>(url: string): Promise<Resultado<T>> {
    try {
      const resposta = await fetch(url, {
        signal: AbortSignal.timeout(5000),
        headers: { Accept: 'application/json' },
      });

      if (resposta.status === 404) {
        return { status: 'nao_encontrado' };
      }

      if (!resposta.ok) {
        return { status: 'indisponivel' };
      }

      return {
        status: 'ok',
        data: (await resposta.json()) as T,
      };
    } catch {
      return { status: 'indisponivel' };
    }
  }

  private async buscarBrasilApi(cep: string): Promise<ResultadoCep> {
    const resultado = await this.requisitar<BrasilApiResponse>(
      `https://brasilapi.com.br/api/cep/v1/${cep}`,
    );

    if (resultado.status !== 'ok') return resultado;

    const dados = resultado.data;

    if (!dados?.city || !dados?.state) {
      return { status: 'indisponivel' };
    }

    return {
      status: 'ok',
      data: {
        cep,
        logradouro: dados.street ?? '',
        bairro: dados.neighborhood ?? '',
        cidade: dados.city,
        uf: dados.state,
        fonte: 'BrasilAPI',
      },
    };
  }

  private async buscarViaCep(cep: string): Promise<ResultadoCep> {
    const resultado = await this.requisitar<ViaCepResponse>(
      `https://viacep.com.br/ws/${cep}/json/`,
    );

    if (resultado.status !== 'ok') return resultado;

    const dados = resultado.data;

    if (dados?.erro === true) {
      return { status: 'nao_encontrado' };
    }

    if (!dados?.localidade || !dados?.uf) {
      return { status: 'indisponivel' };
    }

    return {
      status: 'ok',
      data: {
        cep,
        logradouro: dados.logradouro ?? '',
        bairro: dados.bairro ?? '',
        cidade: dados.localidade,
        uf: dados.uf,
        fonte: 'ViaCEP',
      },
    };
  }
}
