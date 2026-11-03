import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../database/prisma.service.js';
import { ListarConsultasDto } from './dto/listar-consultas.dto.js';

@Injectable()
export class ConsultasService {
  constructor(private readonly prisma: PrismaService) {}

  private converterDataLocal(valor: string): Date {
    const [ano, mes, dia] = valor.split('-').map(Number);

    const verificacao = new Date(Date.UTC(ano, mes - 1, dia));

    if (verificacao.toISOString().slice(0, 10) !== valor) {
      throw new BadRequestException('Data inválida.');
    }

    return new Date(`${valor}T00:00:00-03:00`);
  }

  async listar(filtros: ListarConsultasDto) {
    const paginaSolicitada = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 5;

    const where: Prisma.ConsultaWhereInput = {};

    if (filtros.busca?.trim()) {
      const busca = filtros.busca.trim();

      where.OR = [
        {
          termo: {
            contains: busca,
            mode: 'insensitive',
          },
        },
        {
          tipo: {
            contains: busca,
            mode: 'insensitive',
          },
        },
        {
          fonte: {
            contains: busca,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (filtros.tipo?.trim()) {
      where.tipo = {
        equals: filtros.tipo.trim(),
        mode: 'insensitive',
      };
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    const inicio = filtros.dataInicio
      ? this.converterDataLocal(filtros.dataInicio)
      : undefined;

    const fim = filtros.dataFim
      ? this.converterDataLocal(filtros.dataFim)
      : undefined;

    if (inicio && fim && inicio > fim) {
      throw new BadRequestException(
        'A data inicial não pode ser posterior à data final.',
      );
    }

    if (inicio || fim) {
      where.criadoEm = {
        ...(inicio ? { gte: inicio } : {}),
        ...(fim
          ? { lt: new Date(fim.getTime() + 86400000) }
          : {}),
      };
    }

    const [
      total,
      totalFiltrado,
      totalSucesso,
      estatisticas,
    ] = await this.prisma.$transaction([
      this.prisma.consulta.count(),

      this.prisma.consulta.count({
        where,
      }),

      this.prisma.consulta.count({
        where: {
          AND: [where, { status: 'SUCESSO' }],
        },
      }),

      this.prisma.consulta.aggregate({
        where,
        _avg: {
          tempoMs: true,
        },
      }),
    ]);

    const totalPaginas = Math.max(
      1,
      Math.ceil(totalFiltrado / limite),
    );

    const pagina = Math.min(
      paginaSolicitada,
      totalPaginas,
    );

    const consultas = await this.prisma.consulta.findMany({
      where,
      orderBy: [
        { criadoEm: 'desc' },
        { id: 'desc' },
      ],
      skip: (pagina - 1) * limite,
      take: limite,
    });

    return {
      total,
      totalFiltrado,
      pagina,
      limite,
      totalPaginas,
      indicadores: {
        sucesso: totalSucesso,
        tempoMedio:
          estatisticas._avg.tempoMs === null
            ? 0
            : Math.round(estatisticas._avg.tempoMs),
      },
      consultas,
    };
  }
}