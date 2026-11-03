var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let ConsultasService = class ConsultasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    converterDataLocal(valor) {
        const [ano, mes, dia] = valor.split('-').map(Number);
        const verificacao = new Date(Date.UTC(ano, mes - 1, dia));
        if (verificacao.toISOString().slice(0, 10) !== valor) {
            throw new BadRequestException('Data inválida.');
        }
        return new Date(`${valor}T00:00:00-03:00`);
    }
    async listar(filtros) {
        const paginaSolicitada = filtros.pagina ?? 1;
        const limite = filtros.limite ?? 5;
        const where = {};
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
            throw new BadRequestException('A data inicial não pode ser posterior à data final.');
        }
        if (inicio || fim) {
            where.criadoEm = {
                ...(inicio ? { gte: inicio } : {}),
                ...(fim
                    ? { lt: new Date(fim.getTime() + 86400000) }
                    : {}),
            };
        }
        const [total, totalFiltrado, totalSucesso, estatisticas,] = await this.prisma.$transaction([
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
        const totalPaginas = Math.max(1, Math.ceil(totalFiltrado / limite));
        const pagina = Math.min(paginaSolicitada, totalPaginas);
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
                tempoMedio: estatisticas._avg.tempoMs === null
                    ? 0
                    : Math.round(estatisticas._avg.tempoMs),
            },
            consultas,
        };
    }
};
ConsultasService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ConsultasService);
export { ConsultasService };
//# sourceMappingURL=consultas.service.js.map