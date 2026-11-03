
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';

import { LocalidadesService } from '../../core/services/localidades.service';

import {
  Estado,
  Municipio,
  FiltrosMunicipios,
} from '../../core/models/localidade.model';

@Component({
  selector: 'app-localidades-page',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './localidades.page.html',
  styleUrl: './localidades.page.scss',
})
export class LocalidadesPage implements OnInit, OnDestroy {
  private readonly localidadesService = inject(LocalidadesService);

  private requisicaoEstados?: Subscription;
  private requisicaoMunicipios?: Subscription;

  readonly estados = signal<Estado[]>([]);
  readonly municipios = signal<Municipio[]>([]);
  readonly selecionado = signal<Municipio | null>(null);

  readonly uf = signal('SP');
  readonly busca = signal('');
  readonly buscaAplicada = signal('');

  readonly pagina = signal(1);
  readonly limite = signal(10);
  readonly total = signal(0);
  readonly totalFiltrado = signal(0);
  readonly totalPaginas = signal(1);

  readonly atualizadoEm = signal<string | null>(null);
  readonly cacheDesatualizado = signal(false);

  readonly carregandoEstados = signal(false);
  readonly carregandoMunicipios = signal(false);

  readonly erroEstados = signal('');
  readonly erroMunicipios = signal('');

  readonly estadoSelecionado = computed(() =>
    this.estados().find(
      (estado) => estado.sigla === this.uf(),
    ) ?? null
  );

  ngOnInit(): void {
    this.carregarEstados();
  }

  ngOnDestroy(): void {
    this.requisicaoEstados?.unsubscribe();
    this.requisicaoMunicipios?.unsubscribe();
  }

  carregarEstados(): void {
    this.requisicaoEstados?.unsubscribe();

    this.carregandoEstados.set(true);
    this.erroEstados.set('');

    this.requisicaoEstados = this.localidadesService
      .listarEstados()
      .pipe(
        finalize(() => this.carregandoEstados.set(false)),
      )
      .subscribe({
        next: (resposta) => {
          this.estados.set(resposta.estados);

          if (!resposta.estados.some(
            (estado) => estado.sigla === this.uf(),
          )) {
            this.uf.set(resposta.estados[0]?.sigla ?? '');
          }

          if (this.uf()) {
            this.carregarMunicipios();
          }
        },
        error: () => {
          this.erroEstados.set(
            'Não foi possível carregar os estados do IBGE.',
          );
        },
      });
  }

  private obterFiltros(): FiltrosMunicipios {
    return {
      busca: this.buscaAplicada(),
      pagina: this.pagina(),
      limite: this.limite(),
    };
  }

  carregarMunicipios(registrar = false): void {
    this.requisicaoMunicipios?.unsubscribe();

    if (!this.uf()) {
      return;
    }

    this.carregandoMunicipios.set(true);
    this.erroMunicipios.set('');

    const filtros = this.obterFiltros();

    const consulta = registrar
      ? this.localidadesService.pesquisarMunicipios(
          this.uf(),
          filtros,
        )
      : this.localidadesService.listarMunicipios(
          this.uf(),
          filtros,
        );

    this.requisicaoMunicipios = consulta
      .pipe(
        finalize(() => this.carregandoMunicipios.set(false)),
      )
      .subscribe({
        next: (resposta) => {
          this.municipios.set(resposta.municipios);
          this.total.set(resposta.total);
          this.totalFiltrado.set(resposta.totalFiltrado);
          this.totalPaginas.set(resposta.totalPaginas);
          this.pagina.set(resposta.pagina);

          this.atualizadoEm.set(resposta.atualizadoEm);
          this.cacheDesatualizado.set(
            resposta.cacheDesatualizado,
          );
        },
        error: () => {
          this.municipios.set([]);
          this.selecionado.set(null);
          this.total.set(0);
          this.totalFiltrado.set(0);

          this.erroMunicipios.set(
            'Não foi possível consultar os municípios. Tente novamente.',
          );
        },
      });
  }

  alterarUf(valor: string): void {
    this.uf.set(valor);
    this.busca.set('');
    this.buscaAplicada.set('');
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregarMunicipios();
  }

  pesquisar(): void {
    if (this.carregandoMunicipios()) return;

    const termo = this.busca().trim();

    this.buscaAplicada.set(termo);
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregarMunicipios(termo.length > 0);
  }

  limpar(): void {
    this.busca.set('');
    this.buscaAplicada.set('');
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregarMunicipios();
  }

  mudarPagina(direcao: number): void {
    const proxima = this.pagina() + direcao;

    if (
      this.carregandoMunicipios() ||
      proxima < 1 ||
      proxima > this.totalPaginas()
    ) {
      return;
    }

    this.pagina.set(proxima);
    this.selecionado.set(null);

    this.carregarMunicipios();
  }

  alterarLimite(valor: number): void {
    this.limite.set(valor);
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregarMunicipios();
  }

  selecionar(municipio: Municipio): void {
    this.selecionado.set(municipio);
  }
}
