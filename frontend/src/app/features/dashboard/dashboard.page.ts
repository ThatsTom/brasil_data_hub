
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe,
} from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import Chart from 'chart.js/auto';

import {
  finalize,
  Subscription,
} from 'rxjs';

import { DashboardService } from '../../core/services/dashboard.service';

import type {
  DashboardFiltros,
  DashboardResposta,
} from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
})
export class DashboardPage
  implements OnInit, AfterViewInit, OnDestroy {

  private readonly dashboardService =
    inject(DashboardService);

  private requisicao?: Subscription;

  private viewPronta = false;

  private graficos: Array<{
    destroy(): void;
  }> = [];

  @ViewChild('graficoEvolucao')
  graficoEvolucao?: ElementRef<HTMLCanvasElement>;

  @ViewChild('graficoModulos')
  graficoModulos?: ElementRef<HTMLCanvasElement>;

  @ViewChild('graficoFontes')
  graficoFontes?: ElementRef<HTMLCanvasElement>;

  readonly periodo =
    signal<7 | 30 | 90 | 0>(30);

  readonly tipo = signal('');
  readonly inicio = signal('');
  readonly fim = signal('');

  readonly dados =
    signal<DashboardResposta | null>(null);

  readonly carregando = signal(false);
  readonly erro = signal('');

  readonly modulos = [
    {
      tipo: '',
      nome: 'Todos os módulos',
    },
    {
      tipo: 'CEP',
      nome: 'Consulta de CEP',
    },
    {
      tipo: 'CNPJ',
      nome: 'Consulta de CNPJ',
    },
    {
      tipo: 'BANCO',
      nome: 'Diretório de Bancos',
    },
    {
      tipo: 'MUNICIPIO',
      nome: 'Estados e Municípios',
    },
    {
      tipo: 'FERIADO',
      nome: 'Calendário de Feriados',
    },
  ];

  private readonly cores = [
    '#2563eb',
    '#0d9488',
    '#f59e0b',
    '#7c3aed',
    '#f43f5e',
    '#0891b2',
    '#65a30d',
    '#64748b',
  ];

  ngOnInit(): void {
    this.carregar();
  }

  ngAfterViewInit(): void {
    this.viewPronta = true;
    this.renderizarGraficos();
  }

  ngOnDestroy(): void {
    this.requisicao?.unsubscribe();
    this.destruirGraficos();
  }

  alterarPeriodo(valor: number): void {
    this.periodo.set(
      valor as 0 | 7 | 30 | 90,
    );
  }

  carregar(): void {
    if (this.periodo() === 0) {
      if (!this.inicio() || !this.fim()) {
        this.erro.set(
          'Preencha a data inicial e a data final.',
        );

        return;
      }

      if (this.inicio() > this.fim()) {
        this.erro.set(
          'A data inicial deve ser anterior à data final.',
        );

        return;
      }
    }

    this.requisicao?.unsubscribe();

    this.carregando.set(true);
    this.erro.set('');

    const filtros: DashboardFiltros = {
      tipo: this.tipo() || undefined,
    };

    if (this.periodo() === 0) {
      filtros.inicio = this.inicio();
      filtros.fim = this.fim();
    } else {
      filtros.periodo =
        this.periodo() as 7 | 30 | 90;
    }

    this.requisicao = this.dashboardService
      .obterResumo(filtros)
      .pipe(
        finalize(() =>
          this.carregando.set(false),
        ),
      )
      .subscribe({
        next: (resposta) => {
          this.dados.set(resposta);
          this.renderizarGraficos();
        },

        error: (erro: HttpErrorResponse) => {
          this.dados.set(null);
          this.destruirGraficos();

          this.erro.set(
            erro.error?.message &&
            typeof erro.error.message === 'string'
              ? erro.error.message
              : 'Não foi possível carregar os indicadores.',
          );
        },
      });
  }

  private destruirGraficos(): void {
    for (const grafico of this.graficos) {
      grafico.destroy();
    }

    this.graficos = [];
  }

  private renderizarGraficos(): void {
    if (!this.viewPronta || !this.dados()) {
      return;
    }

    const dados = this.dados()!;

    const evolucao =
      this.graficoEvolucao?.nativeElement;

    const modulos =
      this.graficoModulos?.nativeElement;

    const fontes =
      this.graficoFontes?.nativeElement;

    if (
      !evolucao ||
      !modulos ||
      !fontes
    ) {
      return;
    }

    this.destruirGraficos();

    const serie = dados.serieDiaria;

    this.graficos.push(
      new Chart(evolucao, {
        type: 'line',

        data: {
          labels: serie.map((dia) => {
            const partes = dia.data.split('-');

            return `${partes[2]}/${partes[1]}`;
          }),

          datasets: [
            {
              label: 'Total',
              data: serie.map(
                (dia) => dia.total,
              ),
              borderColor: '#2563eb',
              backgroundColor: '#2563eb',
              borderWidth: 2,
              tension: 0.3,
              pointRadius:
                serie.length > 31 ? 0 : 3,
            },
            {
              label: 'Sucesso',
              data: serie.map(
                (dia) => dia.sucesso,
              ),
              borderColor: '#16a34a',
              backgroundColor: '#16a34a',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 0,
            },
            {
              label: 'Indisponível',
              data: serie.map(
                (dia) => dia.indisponivel,
              ),
              borderColor: '#dc2626',
              backgroundColor: '#dc2626',
              borderWidth: 2,
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,

          interaction: {
            mode: 'index',
            intersect: false,
          },

          plugins: {
            legend: {
              position: 'bottom',
            },
          },

          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 10,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
        },
      }),
    );

    this.graficos.push(
      new Chart(modulos, {
        type: 'doughnut',

        data: {
          labels: dados.porModulo.map(
            (item) => item.tipo,
          ),

          datasets: [
            {
              data: dados.porModulo.map(
                (item) => item.total,
              ),

              backgroundColor:
                dados.porModulo.map(
                  (_, indice) =>
                    this.cores[
                      indice % this.cores.length
                    ],
                ),

              borderWidth: 3,
              borderColor: '#ffffff',
            },
          ],
        },

        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '67%',

          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      }),
    );

    const fontesOrdenadas =
      dados.porFonte.slice(0, 8);

    this.graficos.push(
      new Chart(fontes, {
        type: 'bar',

        data: {
          labels: fontesOrdenadas.map(
            (item) => item.fonte,
          ),

          datasets: [
            {
              label: 'Tempo médio (ms)',

              data: fontesOrdenadas.map(
                (item) => item.tempoMedio,
              ),

              backgroundColor: '#2563eb',
              borderRadius: 6,
              maxBarThickness: 44,
            },
          ],
        },

        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false,
            },
          },

          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'ms',
              },
            },

            y: {
              grid: {
                display: false,
              },
            },
          },
        },
      }),
    );
  }

  exportarCsv(): void {
    const resposta = this.dados();

    if (!resposta) {
      return;
    }

    const linhas = [
      [
        'Data',
        'Total',
        'Sucesso',
        'Nao encontrado',
        'Indisponivel',
      ],

      ...resposta.serieDiaria.map(
        (dia) => [
          dia.data,
          String(dia.total),
          String(dia.sucesso),
          String(dia.naoEncontrado),
          String(dia.indisponivel),
        ],
      ),
    ];

    const conteudo = linhas
      .map((linha) => linha.join(';'))
      .join('\r\n');

    const arquivo = new Blob(
      ['\uFEFF', conteudo],
      {
        type: 'text/csv;charset=utf-8',
      },
    );

    const url = URL.createObjectURL(arquivo);

    const link = document.createElement('a');

    link.href = url;

    link.download = [
      'dashboard',
      resposta.filtros.inicio,
      resposta.filtros.fim,
    ].join('-') + '.csv';

    link.click();

    URL.revokeObjectURL(url);
  }

  formatarVariacao(
    valor: number | null,
  ): string {
    if (valor === null) {
      return '—';
    }

    const prefixo = valor > 0 ? '+' : '';

    const numero = new Intl.NumberFormat(
      'pt-BR',
      {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      },
    ).format(valor);

    return `${prefixo}${numero}%`;
  }

  nomeStatus(status: string): string {
    const nomes: Record<string, string> = {
      SUCESSO: 'Sucesso',
      NAO_ENCONTRADO: 'Não encontrado',
      INDISPONIVEL: 'Indisponível',
    };

    return nomes[status] ?? status;
  }

  tempo(
    tempoMs: number | null,
  ): string {
    return tempoMs === null
      ? '—'
      : `${tempoMs} ms`;
  }
}
