import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';

import { ConsultasService } from '../../core/services/consultas.service';

import {
  Consulta,
  FiltrosConsultas,
} from '../../core/models/consulta.model';

@Component({
  selector: 'app-historico-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './historico.page.html',
  styleUrl: './historico.page.scss',
})
export class HistoricoPage implements OnInit, OnDestroy {
  private readonly consultasService = inject(ConsultasService);
  private requisicao?: Subscription;

  readonly consultas = signal<Consulta[]>([]);

  readonly total = signal(0);
  readonly totalFiltrado = signal(0);
  readonly totalPaginas = signal(1);

  readonly indicadores = signal({
    sucesso: 0,
    tempoMedio: 0,
  });

  readonly pagina = signal(1);
  readonly limite = signal(2);

  readonly busca = signal('');
  readonly tipo = signal('');
  readonly status = signal('');
  readonly dataInicio = signal('');
  readonly dataFim = signal('');

  readonly carregando = signal(false);
  readonly erro = signal('');

  ngOnInit(): void {
    this.carregar();
  }

  ngOnDestroy(): void {
    this.requisicao?.unsubscribe();
  }

  carregar(): void {
    this.requisicao?.unsubscribe();

    const filtros: FiltrosConsultas = {
      pagina: this.pagina(),
      limite: this.limite(),
      busca: this.busca(),
      tipo: this.tipo(),
      status: this.status(),
      dataInicio: this.dataInicio(),
      dataFim: this.dataFim(),
    };

    this.carregando.set(true);
    this.erro.set('');

    this.requisicao = this.consultasService
      .listar(filtros)
      .pipe(
        finalize(() => this.carregando.set(false)),
      )
      .subscribe({
        next: (resposta) => {
          this.consultas.set(resposta.consultas);
          this.total.set(resposta.total);
          this.totalFiltrado.set(resposta.totalFiltrado);
          this.totalPaginas.set(resposta.totalPaginas);
          this.pagina.set(resposta.pagina);
          this.indicadores.set(resposta.indicadores);
        },

        error: () => {
          this.consultas.set([]);

          this.erro.set(
            'Não foi possível carregar os registros. Verifique os filtros e tente novamente.',
          );
        },
      });
  }

  aplicarFiltros(): void {
    this.pagina.set(1);
    this.carregar();
  }

  limparFiltros(): void {
    this.busca.set('');
    this.tipo.set('');
    this.status.set('');
    this.dataInicio.set('');
    this.dataFim.set('');
    this.pagina.set(1);

    this.carregar();
  }

  mudarPagina(direcao: number): void {
    const proxima = this.pagina() + direcao;

    if (proxima < 1 || proxima > this.totalPaginas()) {
      return;
    }

    this.pagina.set(proxima);
    this.carregar();
  }

  alterarLimite(valor: number): void {
    this.limite.set(valor);
    this.pagina.set(1);
    this.carregar();
  }
}