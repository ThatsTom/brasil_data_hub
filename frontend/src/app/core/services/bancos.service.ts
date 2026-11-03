import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Banco,
  FiltrosBancos,
  RespostaBancos,
} from '../models/banco.model';

@Injectable({
  providedIn: 'root',
})
export class BancosService {
  private readonly http = inject(HttpClient);

  listar(filtros: FiltrosBancos): Observable<RespostaBancos> {
    const params = new HttpParams()
      .set('busca', filtros.busca)
      .set('pagina', filtros.pagina.toString())
      .set('limite', filtros.limite.toString());

    return this.http.get<RespostaBancos>(
      '/api/v1/bancos',
      { params },
    );
  }

  pesquisar(filtros: FiltrosBancos): Observable<RespostaBancos> {
    return this.http.post<RespostaBancos>(
      '/api/v1/bancos/pesquisar',
      filtros,
    );
  }

  obterPorCodigo(codigo: number): Observable<Banco> {
    return this.http.get<Banco>(
      `/api/v1/bancos/${codigo}`,
    );
  }
}