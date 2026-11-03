var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FeriadosService_1;
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, ServiceUnavailableException, } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let FeriadosService = FeriadosService_1 = class FeriadosService {
    prisma;
    logger = new Logger(FeriadosService_1.name);
    baseUrl = 'https://brasilapi.com.br/api/feriados/v1';
    duracaoCache = 24 * 60 * 60 * 1000;
    cache = new Map();
    carregamentos = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    validarAno(ano) {
        if (!Number.isInteger(ano) ||
            ano < 1900 ||
            ano > 2199) {
            throw new BadRequestException('Informe um ano entre 1900 e 2199.');
        }
    }
    async buscarNaBrasilApi(ano) {
        const resposta = await fetch(`${this.baseUrl}/${ano}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Agent': 'BrasilDataHub/1.0',
            },
            signal: AbortSignal.timeout(10000),
        });
        if (resposta.status === 429) {
            throw new HttpException('Limite de consultas da BrasilAPI atingido.', HttpStatus.TOO_MANY_REQUESTS);
        }
        if (!resposta.ok) {
            throw new Error(`BrasilAPI retornou HTTP ${resposta.status}`);
        }
        const dados = await resposta.json();
        if (!Array.isArray(dados)) {
            throw new Error('A BrasilAPI retornou um formato inválido.');
        }
        const feriados = dados
            .filter((item) => item !== null &&
            typeof item === 'object' &&
            'date' in item &&
            'name' in item &&
            typeof item.date === 'string' &&
            typeof item.name === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
            item.date.startsWith(`${ano}-`))
            .map((item) => ({
            data: item.date,
            nome: item.name,
            tipo: typeof item.type === 'string'
                ? item.type
                : 'nao_informado',
        }))
            .sort((a, b) => a.data.localeCompare(b.data));
        if (feriados.length === 0) {
            throw new Error('Nenhuma data válida foi retornada pela BrasilAPI.');
        }
        return feriados;
    }
    async obterCache(ano) {
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
            .then((feriados) => {
            const resultado = {
                feriados,
                atualizadoEm: new Date().toISOString(),
                expiraEm: Date.now() + this.duracaoCache,
                desatualizado: false,
            };
            this.cache.set(ano, resultado);
            this.logger.log(`${feriados.length} datas carregadas para ${ano}.`);
            return resultado;
        })
            .catch((erro) => {
            this.logger.warn(erro instanceof Error
                ? erro.message
                : 'Falha desconhecida ao consultar feriados.');
            if (anterior) {
                const recuperado = {
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
            throw new ServiceUnavailableException('O serviço de feriados está temporariamente indisponível.');
        })
            .finally(() => {
            this.carregamentos.delete(ano);
        });
        this.carregamentos.set(ano, carregamento);
        return carregamento;
    }
    async listar(ano) {
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
    async consultar(ano) {
        this.validarAno(ano);
        const inicio = Date.now();
        let status = 'INDISPONIVEL';
        try {
            const resultado = await this.listar(ano);
            status = 'SUCESSO';
            return resultado;
        }
        finally {
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
};
FeriadosService = FeriadosService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FeriadosService);
export { FeriadosService };
//# sourceMappingURL=feriados.service.js.map