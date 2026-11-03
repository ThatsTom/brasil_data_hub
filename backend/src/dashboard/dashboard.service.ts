import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service.js';
import { DashboardFiltrosDto } from './dto/dashboard-filtros.dto.js';

import type { Prisma } from '../generated/prisma/client.js';

import type {
  DiaDashboard,
  RespostaDashboard,
} from './dashboard.types.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private hojeBrasilia(): string {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());

    const mapa = new Map(
      partes.map((parte) => [parte.type, parte.value]),
    );

    return [
      mapa.get('year'),
      mapa.get('month'),
      mapa.get('day'),
    ].join('-');
  }

  private lerData(valor: string): Date {
    const data = new Date(`${valor}T00:00:00Z`);

    if (
      Number.isNaN(data.getTime()) ||
      data.toISOString().slice(0, 10) !== valor
    ) {
      throw new BadRequestException(
        'Data informada é inválida.',
      );
    }

    return data;
  }

  private somarDias(
    dataIso: string,
    dias: number,
  ): string {
    const data = this.lerData(dataIso);

    data.setUTCDate(data.getUTCDate() + dias);

    return data.toISOString().slice(0, 10);
  }

  private calcularPeriodo(
    filtros: DashboardFiltrosDto,
  ) {
    const temInicio = filtros.inicio !== undefined;
    const temFim = filtros.fim !== undefined;

    if (temInicio !== temFim) {
      throw new BadRequestException(
        'Informe as duas datas para o período personalizado.',
      );
    }

    let inicio: string;
    let fim: string;

    if (temInicio && temFim) {
      inicio = filtros.inicio!;
      fim = filtros.fim!;

      this.lerData(inicio);
      this.lerData(fim);
    } else {
      fim = this.hojeBrasilia();

      inicio = this.somarDias(
        fim,
        -(filtros.periodo - 1),
      );
    }

    const quantidadeDias =
      (
        this.lerData(fim).getTime() -
        this.lerData(inicio).getTime()
      ) / 86_400_000 + 1;

    if (
      quantidadeDias < 1 ||
      quantidadeDias > 366
    ) {
      throw new BadRequestException(
        'O período deve ter entre 1 e 366 dias.',
      );
    }

    const inicioUtc = new Date(
      `${inicio}T00:00:00-03:00`,
    );

    const fimExclusivoUtc = new Date(
      `${this.somarDias(fim, 1)}T00:00:00-03:00`,
    );

    const duracaoMs =
      fimExclusivoUtc.getTime() -
      inicioUtc.getTime();

    const inicioAnteriorUtc = new Date(
      inicioUtc.getTime() - duracaoMs,
    );

    return {
      inicio,
      fim,
      inicioUtc,
      fimExclusivoUtc,
      inicioAnteriorUtc,
    };
  }

  private porcentagem(
    parte: number,
    total: number,
  ): number {
    return total > 0
      ? Math.round((parte / total) * 1000) / 10
      : 0;
  }

  private media(
    valor: number | null,
  ): number | null {
    return valor === null
      ? null
      : Math.round(valor);
  }

  async obterResumo(
    filtros: DashboardFiltrosDto,
  ): Promise<RespostaDashboard> {
    const periodo = this.calcularPeriodo(filtros);

    const tipo =
      filtros.tipo?.trim().toUpperCase() || null;

    const where: Prisma.ConsultaWhereInput = {
      criadoEm: {
        gte: periodo.inicioUtc,
        lt: periodo.fimExclusivoUtc,
      },
      ...(tipo ? { tipo } : {}),
    };

    const whereAnterior: Prisma.ConsultaWhereInput = {
      criadoEm: {
        gte: periodo.inicioAnteriorUtc,
        lt: periodo.inicioUtc,
      },
      ...(tipo ? { tipo } : {}),
    };

    type LinhaDiaria = DiaDashboard;

    type TermoAgrupado = {
      tipo: string;
      termo: string;
      total: number;
    };

    const [
      agregado,
      statusAgrupados,
      modulos,
      modulosSucesso,
      fontes,
      fontesSucesso,
      maisPesquisados,
      recentes,
      periodoAnterior,
      diasAgrupados,
    ] = await Promise.all([
      this.prisma.consulta.aggregate({
        where,
        _count: {
          _all: true,
        },
        _avg: {
          tempoMs: true,
        },
      }),

      this.prisma.consulta.groupBy({
        by: ['status'],
        where,
        _count: {
          _all: true,
        },
      }),

      this.prisma.consulta.groupBy({
        by: ['tipo'],
        where,
        _count: {
          _all: true,
        },
        _avg: {
          tempoMs: true,
        },
      }),

      this.prisma.consulta.groupBy({
        by: ['tipo'],
        where: {
          AND: [
            where,
            { status: 'SUCESSO' },
          ],
        },
        _count: {
          _all: true,
        },
      }),

      this.prisma.consulta.groupBy({
        by: ['fonte'],
        where,
        _count: {
          _all: true,
        },
        _avg: {
          tempoMs: true,
        },
      }),

      this.prisma.consulta.groupBy({
        by: ['fonte'],
        where: {
          AND: [
            where,
            { status: 'SUCESSO' },
          ],
        },
        _count: {
          _all: true,
        },
      }),

      this.prisma.$queryRaw<TermoAgrupado[]>`
        SELECT
          "tipo",
          "termo",
          COUNT(*)::int AS "total"
        FROM "consultas"
        WHERE "criadoEm" >= ${periodo.inicioUtc}
          AND "criadoEm" < ${periodo.fimExclusivoUtc}
          AND (
            ${tipo}::text IS NULL
            OR "tipo" = ${tipo}
          )
        GROUP BY "tipo", "termo"
        ORDER BY
          COUNT(*) DESC,
          "tipo" ASC,
          "termo" ASC
        LIMIT 8
      `,

      this.prisma.consulta.findMany({
        where,
        select: {
          id: true,
          tipo: true,
          termo: true,
          status: true,
          fonte: true,
          tempoMs: true,
          criadoEm: true,
        },
        orderBy: [
          { criadoEm: 'desc' },
          { id: 'desc' },
        ],
        take: 10,
      }),

      this.prisma.consulta.count({
        where: whereAnterior,
      }),

      this.prisma.$queryRaw<LinhaDiaria[]>`
        SELECT
          TO_CHAR(
            (
              "criadoEm"
              AT TIME ZONE 'UTC'
              AT TIME ZONE 'America/Sao_Paulo'
            )::date,
            'YYYY-MM-DD'
          ) AS "data",
          COUNT(*)::int AS "total",
          COUNT(*) FILTER (
            WHERE "status" = 'SUCESSO'
          )::int AS "sucesso",
          COUNT(*) FILTER (
            WHERE "status" = 'NAO_ENCONTRADO'
          )::int AS "naoEncontrado",
          COUNT(*) FILTER (
            WHERE "status" = 'INDISPONIVEL'
          )::int AS "indisponivel"
        FROM "consultas"
        WHERE "criadoEm" >= ${periodo.inicioUtc}
          AND "criadoEm" < ${periodo.fimExclusivoUtc}
          AND (
            ${tipo}::text IS NULL
            OR "tipo" = ${tipo}
          )
        GROUP BY 1
        ORDER BY 1
      `,
    ]);

    const quantidade = agregado._count._all;

    const contagemStatus = new Map(
      statusAgrupados.map((item) => [
        item.status,
        item._count._all,
      ]),
    );

    const sucesso =
      contagemStatus.get('SUCESSO') ?? 0;

    const naoEncontrado =
      contagemStatus.get('NAO_ENCONTRADO') ?? 0;

    const indisponivel =
      contagemStatus.get('INDISPONIVEL') ?? 0;

    const sucessoModulo = new Map(
      modulosSucesso.map((item) => [
        item.tipo,
        item._count._all,
      ]),
    );

    const sucessoFonte = new Map(
      fontesSucesso.map((item) => [
        item.fonte,
        item._count._all,
      ]),
    );

    const diasPorData = new Map(
      diasAgrupados.map((item) => [
        item.data,
        item,
      ]),
    );

    const serieDiaria: DiaDashboard[] = [];

    for (
      let data = periodo.inicio;
      data <= periodo.fim;
      data = this.somarDias(data, 1)
    ) {
      serieDiaria.push(
        diasPorData.get(data) ?? {
          data,
          total: 0,
          sucesso: 0,
          naoEncontrado: 0,
          indisponivel: 0,
        },
      );
    }

    const variacaoPercentual =
      periodoAnterior === 0
        ? quantidade === 0
          ? 0
          : null
        : Math.round(
            (
              (quantidade - periodoAnterior) /
              periodoAnterior
            ) * 1000,
          ) / 10;

    return {
      filtros: {
        inicio: periodo.inicio,
        fim: periodo.fim,
        tipo,
      },

      indicadores: {
        total: quantidade,
        sucesso,
        naoEncontrado,
        indisponivel,
        taxaSucesso: this.porcentagem(
          sucesso,
          quantidade,
        ),
        tempoMedio: this.media(
          agregado._avg.tempoMs,
        ),
        periodoAnterior,
        variacaoPercentual,
      },

      serieDiaria,

      porModulo: modulos
        .map((modulo) => {
          const total = modulo._count._all;

          const exitos =
            sucessoModulo.get(modulo.tipo) ?? 0;

          return {
            tipo: modulo.tipo,
            total,
            sucesso: exitos,
            taxaSucesso: this.porcentagem(
              exitos,
              total,
            ),
            tempoMedio: this.media(
              modulo._avg.tempoMs,
            ),
          };
        })
        .sort((a, b) => b.total - a.total),

      porStatus: statusAgrupados
        .map((item) => ({
          status: item.status,
          total: item._count._all,
        }))
        .sort((a, b) => b.total - a.total),

      porFonte: fontes
        .map((fonte) => {
          const total = fonte._count._all;

          const exitos =
            sucessoFonte.get(fonte.fonte) ?? 0;

          return {
            fonte: fonte.fonte ?? 'Não informada',
            total,
            sucesso: exitos,
            taxaSucesso: this.porcentagem(
              exitos,
              total,
            ),
            tempoMedio: this.media(
              fonte._avg.tempoMs,
            ),
          };
        })
        .sort((a, b) => b.total - a.total),

      maisPesquisados,

      recentes: recentes.map((item) => ({
        ...item,
        criadoEm: item.criadoEm.toISOString(),
      })),
    };
  }
}