
import {
    Component,
    OnDestroy,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';

import { FeriadosService } from '../../core/services/feriados.service';

import type {
    DiaCalendario,
    Feriado,
} from '../../core/models/feriado.model';

@Component({
    selector: 'app-feriados-page',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: './feriados.page.html',
    styleUrl: './feriados.page.scss',
})
export class FeriadosPage implements OnInit, OnDestroy {
    private readonly feriadosService = inject(FeriadosService);
    private requisicao?: Subscription;

    private readonly dataAtual = new Date();
    private readonly anoInicial = this.dataAtual.getFullYear();

    readonly meses = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ];

    readonly diasSemana = [
        'Seg',
        'Ter',
        'Qua',
        'Qui',
        'Sex',
        'Sáb',
        'Dom',
    ];

    readonly anoDigitado = signal(this.anoInicial);
    readonly anoExibido = signal(this.anoInicial);
    readonly mesAtual = signal(this.dataAtual.getMonth());

    readonly feriados = signal<Feriado[]>([]);
    readonly busca = signal('');
    readonly somenteDiasUteis = signal(false);
    readonly mesFiltro = signal(this.dataAtual.getMonth());

    readonly totalFeriadosUteis = computed(() =>
        this.feriados().filter(feriado =>
            this.caiEmDiaDeSemana(feriado.data)
        ).length
    );

    readonly carregando = signal(false);
    readonly erro = signal('');

    readonly atualizadoEm = signal<string | null>(null);
    readonly cacheDesatualizado = signal(false);

    readonly feriadosMes = computed(() => {
        const mesSelecionado = this.mesFiltro();
        const pesquisa = this.normalizar(this.busca());
        const somenteUteis = this.somenteDiasUteis();

        return this.feriados().filter(feriado => {
            const mesFeriado = Number(
                feriado.data.slice(5, 7)
            ) - 1;

            const correspondeMes =
                mesSelecionado === -1 ||
                mesFeriado === mesSelecionado;

            const correspondePesquisa =
                !pesquisa ||
                this.normalizar(feriado.nome).includes(pesquisa);

            const correspondeDiaUtil =
                !somenteUteis ||
                this.caiEmDiaDeSemana(feriado.data);

            return (
                correspondeMes &&
                correspondePesquisa &&
                correspondeDiaUtil
            );
        });
    });

    readonly totalMes = computed(() => {
        const prefixo = this.prefixoMes();

        return this.feriados().filter(
            (feriado) => feriado.data.startsWith(prefixo),
        ).length;
    });

    readonly calendario = computed((): DiaCalendario[] => {
        const ano = this.anoExibido();
        const mes = this.mesAtual();

        const primeiroDia = new Date(
            Date.UTC(ano, mes, 1),
        ).getUTCDay();

        const deslocamento = (primeiroDia + 6) % 7;

        const quantidadeDias = new Date(
            Date.UTC(ano, mes + 1, 0),
        ).getUTCDate();

        const quantidadeCelulas =
            Math.ceil((deslocamento + quantidadeDias) / 7) * 7;

        const hoje = new Date();

        const dataHoje = [
            hoje.getFullYear(),
            String(hoje.getMonth() + 1).padStart(2, '0'),
            String(hoje.getDate()).padStart(2, '0'),
        ].join('-');

        return Array.from(
            { length: quantidadeCelulas },
            (_, indice): DiaCalendario => {
                const dia = indice - deslocamento + 1;

                if (dia < 1 || dia > quantidadeDias) {
                    return {
                        chave: `vazio-${indice}`,
                        dia: null,
                        data: null,
                        feriados: [],
                        hoje: false,
                    };
                }

                const data = [
                    ano,
                    String(mes + 1).padStart(2, '0'),
                    String(dia).padStart(2, '0'),
                ].join('-');

                return {
                    chave: data,
                    dia,
                    data,
                    feriados: this.feriados().filter(
                        feriado =>
                            feriado.data === data &&
                            (
                                !this.somenteDiasUteis() ||
                                this.caiEmDiaDeSemana(feriado.data)
                            )
                    ),
                    hoje: data === dataHoje,
                };
            },
        );
    });

    ngOnInit(): void {
        this.carregar();
    }

    ngOnDestroy(): void {
        this.requisicao?.unsubscribe();
    }

    private prefixoMes(): string {
        return [
            this.anoExibido(),
            String(this.mesAtual() + 1).padStart(2, '0'),
        ].join('-');
    }

    private normalizar(valor: string): string {
        return valor
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    carregar(registrar = false): void {
        const ano = Number(this.anoDigitado());

        if (
            !Number.isInteger(ano) ||
            ano < 1900 ||
            ano > 2199
        ) {
            this.erro.set(
                'Informe um ano válido entre 1900 e 2199.',
            );

            return;
        }

        this.requisicao?.unsubscribe();

        this.carregando.set(true);
        this.erro.set('');

        const requisicao = registrar
            ? this.feriadosService.consultar(ano)
            : this.feriadosService.listar(ano);

        this.requisicao = requisicao
            .pipe(
                finalize(() => this.carregando.set(false)),
            )
            .subscribe({
                next: (resposta) => {
                    this.feriados.set(resposta.feriados);
                    this.anoExibido.set(resposta.ano);
                    this.anoDigitado.set(resposta.ano);
                    this.atualizadoEm.set(resposta.atualizadoEm);
                    this.cacheDesatualizado.set(
                        resposta.cacheDesatualizado,
                    );
                },

                error: (erro: HttpErrorResponse) => {
                    if (erro.status === 429) {
                        this.erro.set(
                            'Limite de consultas atingido. Tente mais tarde.',
                        );
                    } else if (erro.status === 503) {
                        this.erro.set(
                            'A BrasilAPI está temporariamente indisponível.',
                        );
                    } else if (erro.status === 400) {
                        this.erro.set('Ano informado é inválido.');
                    } else {
                        this.erro.set(
                            'Não foi possível carregar o calendário.',
                        );
                    }
                },
            });
    }

    caiEmDiaDeSemana(data: string): boolean {
        const dataUtc = new Date(`${data}T12:00:00Z`);

        const diaSemana = dataUtc.getUTCDay();

        return diaSemana >= 1 && diaSemana <= 5;
    }

    consultarAno(): void {
        if (this.carregando()) return;

        this.carregar(true);
    }

    navegarMes(direcao: number): void {
        const proximo = this.mesAtual() + direcao;

        if (proximo >= 0 && proximo <= 11) {
            this.mesAtual.set(proximo);

            if (this.mesFiltro() !== -1) {
                this.mesFiltro.set(proximo);
            }
        }
    }

    selecionarMes(mes: number): void {
        if (mes === -1) {
            this.mesFiltro.set(-1);
            return;
        }

        if (mes >= 0 && mes <= 11) {
            this.mesFiltro.set(mes);
            this.mesAtual.set(mes);
        }
    }

    limparBusca(): void {
        this.busca.set('');
    }

    formatarData(data: string): string {
        const [ano, mes, dia] = data.split('-');

        return `${dia}/${mes}/${ano}`;
    }

    diaDaSemana(data: string): string {
        const dataUtc = new Date(`${data}T12:00:00Z`);

        return new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            timeZone: 'UTC',
        }).format(dataUtc);
    }

    traduzirTipo(tipo: string): string {
        if (tipo === 'national') {
            return 'Nacional na API';
        }

        if (tipo === 'state') {
            return 'Estadual na API';
        }

        return tipo;
    }
}
