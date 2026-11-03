var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
let CnpjService = class CnpjService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calcularDigito(base, pesos) {
        const soma = [...base].reduce((total, caractere, indice) => {
            const valor = caractere.charCodeAt(0) - 48;
            return total + valor * pesos[indice];
        }, 0);
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
    validarCnpj(entrada) {
        const cnpj = entrada
            .trim()
            .toUpperCase()
            .replace(/[.\-\/\s]/g, '');
        if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) {
            throw new BadRequestException('Informe um CNPJ com 14 caracteres válidos.');
        }
        if (/^(\d)\1{13}$/.test(cnpj)) {
            throw new BadRequestException('CNPJ inválido.');
        }
        const pesosPrimeiro = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const pesosSegundo = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const primeiro = this.calcularDigito(cnpj.slice(0, 12), pesosPrimeiro);
        const segundo = this.calcularDigito(cnpj.slice(0, 13), pesosSegundo);
        if (cnpj.slice(12) !== `${primeiro}${segundo}`) {
            throw new BadRequestException('Os dígitos verificadores do CNPJ são inválidos.');
        }
        return cnpj;
    }
    mapearEmpresa(dados, cnpj) {
        const situacoes = {
            1: 'NULA',
            2: 'ATIVA',
            3: 'SUSPENSA',
            4: 'INAPTA',
            8: 'BAIXADA',
        };
        const valorCapital = dados.capital_social == null
            ? null
            : Number(dados.capital_social);
        return {
            cnpj,
            razaoSocial: dados.razao_social ?? '',
            nomeFantasia: dados.nome_fantasia ?? null,
            situacaoCadastral: dados.descricao_situacao_cadastral ??
                situacoes[dados.situacao_cadastral ?? 0] ??
                'NÃO INFORMADA',
            dataAbertura: dados.data_inicio_atividade ?? null,
            matrizFilial: dados.descricao_identificador_matriz_filial ?? null,
            naturezaJuridica: dados.natureza_juridica ?? null,
            porte: dados.descricao_porte ?? null,
            capitalSocial: valorCapital !== null && Number.isFinite(valorCapital)
                ? valorCapital
                : null,
            atividadePrincipal: {
                codigo: dados.cnae_fiscal ?? null,
                descricao: dados.cnae_fiscal_descricao ?? null,
            },
            endereco: {
                logradouro: dados.logradouro ?? null,
                numero: dados.numero ?? null,
                complemento: dados.complemento ?? null,
                bairro: dados.bairro ?? null,
                municipio: dados.municipio ?? null,
                uf: dados.uf ?? null,
                cep: dados.cep ?? null,
            },
            fonte: 'BrasilAPI',
        };
    }
    async consultar(entrada) {
        const cnpj = this.validarCnpj(entrada);
        const inicio = Date.now();
        let status = 'INDISPONIVEL';
        let empresa = null;
        let problema = null;
        try {
            const resposta = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'BrasilDataHub/1.0',
                },
                signal: AbortSignal.timeout(10000),
            });
            if (resposta.status === 404) {
                status = 'NAO_ENCONTRADO';
                problema = new NotFoundException('CNPJ não encontrado na base consultada.');
            }
            else if (resposta.status === 429) {
                problema = new HttpException('Limite de consultas atingido. Tente novamente mais tarde.', HttpStatus.TOO_MANY_REQUESTS);
            }
            else if (!resposta.ok) {
                problema = new ServiceUnavailableException('A BrasilAPI não conseguiu processar a consulta.');
            }
            else {
                const dados = (await resposta.json());
                if (!dados?.cnpj || !dados?.razao_social) {
                    problema = new ServiceUnavailableException('O serviço retornou dados incompletos.');
                }
                else {
                    empresa = this.mapearEmpresa(dados, cnpj);
                    status = 'SUCESSO';
                }
            }
        }
        catch {
            problema = new ServiceUnavailableException('A BrasilAPI não respondeu dentro do prazo.');
        }
        await this.prisma.consulta.create({
            data: {
                tipo: 'CNPJ',
                termo: cnpj,
                status,
                fonte: 'BrasilAPI',
                tempoMs: Date.now() - inicio,
            },
        });
        if (problema) {
            throw problema;
        }
        if (!empresa) {
            throw new ServiceUnavailableException('Não foi possível obter os dados da empresa.');
        }
        return empresa;
    }
};
CnpjService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CnpjService);
export { CnpjService };
//# sourceMappingURL=cnpj.service.js.map