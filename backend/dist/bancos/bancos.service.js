var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BancosService_1;
import { Injectable, Logger, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let BancosService = BancosService_1 = class BancosService {
    prisma;
    logger = new Logger(BancosService_1.name);
    tempoCache = 12 * 60 * 60 * 1000;
    cache = null;
    carregamento = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizarTexto(texto) {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }
    async atualizarCatalogo() {
        const resposta = await fetch('https://brasilapi.com.br/api/banks/v1', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'User-Agent': 'BrasilDataHub/1.0',
            },
            signal: AbortSignal.timeout(10000),
        });
        if (!resposta.ok) {
            throw new Error(`BrasilAPI retornou HTTP ${resposta.status}`);
        }
        const dados = await resposta.json();
        if (!Array.isArray(dados)) {
            throw new Error('Formato de resposta inválido.');
        }
        const bancos = dados
            .filter((item) => item !== null &&
            typeof item === 'object' &&
            typeof item.name === 'string' &&
            item.name.trim().length > 0)
            .map((item) => ({
            codigo: typeof item.code === 'number' &&
                Number.isInteger(item.code)
                ? item.code
                : null,
            ispb: item.ispb ?? '',
            nome: item.name.trim(),
            nomeCompleto: item.fullName || item.name.trim(),
            fonte: 'BrasilAPI',
        }))
            .sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto, 'pt-BR'));
        if (!bancos.length) {
            throw new Error('A lista de bancos está vazia.');
        }
        this.cache = {
            bancos,
            atualizadoEm: new Date().toISOString(),
            expiraEm: Date.now() + this.tempoCache,
            desatualizado: false,
        };
        this.logger.log(`Catálogo atualizado: ${bancos.length} instituições.`);
        return this.cache;
    }
    async obterCatalogo() {
        if (this.cache && Date.now() < this.cache.expiraEm) {
            return this.cache;
        }
        if (!this.carregamento) {
            this.carregamento = this.atualizarCatalogo()
                .catch((erro) => {
                const mensagem = erro instanceof Error ? erro.message : String(erro);
                this.logger.warn(mensagem);
                if (this.cache) {
                    this.cache = {
                        ...this.cache,
                        expiraEm: Date.now() + 5 * 60 * 1000,
                        desatualizado: true,
                    };
                    return this.cache;
                }
                throw new ServiceUnavailableException('O diretório de bancos está temporariamente indisponível.');
            })
                .finally(() => {
                this.carregamento = null;
            });
        }
        return this.carregamento;
    }
    async listar(filtros) {
        const catalogo = await this.obterCatalogo();
        const busca = this.normalizarTexto(filtros.busca ?? '');
        const paginaSolicitada = filtros.pagina ?? 1;
        const limite = filtros.limite ?? 10;
        const filtrados = !busca
            ? catalogo.bancos
            : catalogo.bancos.filter((banco) => {
                const codigo = banco.codigo === null
                    ? ''
                    : String(banco.codigo).padStart(3, '0');
                return (this.normalizarTexto(banco.nome).includes(busca) ||
                    this.normalizarTexto(banco.nomeCompleto).includes(busca) ||
                    codigo.includes(busca) ||
                    banco.ispb.includes(busca));
            });
        const totalFiltrado = filtrados.length;
        const totalPaginas = Math.max(1, Math.ceil(totalFiltrado / limite));
        const pagina = Math.min(paginaSolicitada, totalPaginas);
        const inicio = (pagina - 1) * limite;
        return {
            total: catalogo.bancos.length,
            totalFiltrado,
            pagina,
            limite,
            totalPaginas,
            atualizadoEm: catalogo.atualizadoEm,
            cacheDesatualizado: catalogo.desatualizado,
            bancos: filtrados.slice(inicio, inicio + limite),
        };
    }
    async pesquisar(filtros) {
        const termo = filtros.busca?.trim() ?? '';
        if (!termo) {
            return this.listar(filtros);
        }
        const inicio = Date.now();
        let status = 'INDISPONIVEL';
        try {
            const resultado = await this.listar(filtros);
            status =
                resultado.totalFiltrado > 0
                    ? 'SUCESSO'
                    : 'NAO_ENCONTRADO';
            return resultado;
        }
        finally {
            await this.prisma.consulta.create({
                data: {
                    tipo: 'BANCO',
                    termo,
                    status,
                    fonte: 'BrasilAPI',
                    tempoMs: Date.now() - inicio,
                },
            });
        }
    }
    async obterPorCodigo(codigo) {
        const inicio = Date.now();
        let status = 'INDISPONIVEL';
        try {
            const catalogo = await this.obterCatalogo();
            const banco = catalogo.bancos.find((item) => item.codigo === codigo);
            if (!banco) {
                status = 'NAO_ENCONTRADO';
                throw new NotFoundException('Instituição bancária não encontrada.');
            }
            status = 'SUCESSO';
            return banco;
        }
        finally {
            await this.prisma.consulta.create({
                data: {
                    tipo: 'BANCO',
                    termo: String(codigo).padStart(3, '0'),
                    status,
                    fonte: 'BrasilAPI',
                    tempoMs: Date.now() - inicio,
                },
            });
        }
    }
};
BancosService = BancosService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], BancosService);
export { BancosService };
//# sourceMappingURL=bancos.service.js.map