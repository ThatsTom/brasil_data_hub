var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let CepService = class CepService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async consultar(entrada) {
        const valor = entrada.trim();
        if (!/^\d{5}-?\d{3}$/.test(valor)) {
            throw new BadRequestException('Informe um CEP válido com 8 dígitos.');
        }
        const cep = valor.replace('-', '');
        const inicio = Date.now();
        const brasilApi = await this.buscarBrasilApi(cep);
        const resultado = brasilApi.status === 'ok'
            ? brasilApi
            : await this.buscarViaCep(cep);
        const status = resultado.status === 'ok'
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
        throw new ServiceUnavailableException('Os serviços de consulta estão temporariamente indisponíveis.');
    }
    async requisitar(url) {
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
                data: (await resposta.json()),
            };
        }
        catch {
            return { status: 'indisponivel' };
        }
    }
    async buscarBrasilApi(cep) {
        const resultado = await this.requisitar(`https://brasilapi.com.br/api/cep/v1/${cep}`);
        if (resultado.status !== 'ok')
            return resultado;
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
    async buscarViaCep(cep) {
        const resultado = await this.requisitar(`https://viacep.com.br/ws/${cep}/json/`);
        if (resultado.status !== 'ok')
            return resultado;
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
};
CepService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CepService);
export { CepService };
//# sourceMappingURL=cep.service.js.map