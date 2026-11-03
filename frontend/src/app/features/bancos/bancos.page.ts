import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, Subscription } from 'rxjs';

import { BancosService } from '../../core/services/bancos.service';

import {
  Banco,
  FiltrosBancos,
} from '../../core/models/banco.model';

@Component({
  selector: 'app-bancos-page',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './bancos.page.html',
  styleUrl: './bancos.page.scss',
})
export class BancosPage implements OnInit, OnDestroy {
  private readonly bancosService = inject(BancosService);

  private requisicao?: Subscription;

  readonly bancos = signal<Banco[]>([]);
  readonly selecionado = signal<Banco | null>(null);

  readonly busca = signal('');
  readonly buscaAplicada = signal('');

  readonly pagina = signal(1);
  readonly limite = signal(10);
  readonly total = signal(0);
  readonly totalFiltrado = signal(0);
  readonly totalPaginas = signal(1);

  readonly atualizadoEm = signal<string | null>(null);
  readonly cacheDesatualizado = signal(false);

  readonly carregando = signal(false);
  readonly erro = signal('');

  ngOnInit(): void {
    this.carregar();
  }

  ngOnDestroy(): void {
    this.requisicao?.unsubscribe();
  }

  private filtros(): FiltrosBancos {
    return {
      busca: this.buscaAplicada(),
      pagina: this.pagina(),
      limite: this.limite(),
    };
  }

  carregar(registrar = false): void {
    this.requisicao?.unsubscribe();

    this.carregando.set(true);
    this.erro.set('');

    const filtros = this.filtros();

    const requisicao = registrar
      ? this.bancosService.pesquisar(filtros)
      : this.bancosService.listar(filtros);

    this.requisicao = requisicao
      .pipe(
        finalize(() => this.carregando.set(false)),
      )
      .subscribe({
        next: (resposta) => {
          this.bancos.set(resposta.bancos);
          this.total.set(resposta.total);
          this.totalFiltrado.set(resposta.totalFiltrado);
          this.totalPaginas.set(resposta.totalPaginas);
          this.pagina.set(resposta.pagina);
          this.atualizadoEm.set(resposta.atualizadoEm);
          this.cacheDesatualizado.set(
            resposta.cacheDesatualizado,
          );
        },

        error: (erro: HttpErrorResponse) => {
          this.bancos.set([]);
          this.selecionado.set(null);

          this.erro.set(
            erro.status === 503
              ? 'A fonte de dados está indisponível. Tente novamente mais tarde.'
              : 'Não foi possível carregar o diretório de bancos.',
          );
        },
      });
  }

  pesquisar(): void {
    if (this.carregando()) return;

    const termo = this.busca().trim();

    this.buscaAplicada.set(termo);
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregar(termo.length > 0);
  }

  limpar(): void {
    this.busca.set('');
    this.buscaAplicada.set('');
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregar();
  }

  mudarPagina(direcao: number): void {
    const proxima = this.pagina() + direcao;

    if (
      this.carregando() ||
      proxima < 1 ||
      proxima > this.totalPaginas()
    ) {
      return;
    }

    this.pagina.set(proxima);
    this.selecionado.set(null);
    this.carregar();
  }

  alterarLimite(valor: number): void {
    this.limite.set(valor);
    this.pagina.set(1);
    this.selecionado.set(null);

    this.carregar();
  }

  selecionar(banco: Banco): void {
    this.selecionado.set(banco);
  }

  formatarCodigo(codigo: number | null): string {
    return codigo === null
      ? 'Não informado'
      : String(codigo).padStart(3, '0');
  }
}