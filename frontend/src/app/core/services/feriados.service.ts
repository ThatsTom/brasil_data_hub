import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  RespostaFeriados,
} from '../models/feriado.model';

@Injectable({
  providedIn: 'root',
})
export class FeriadosService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/v1/feriados';

  listar(ano: number): Observable<RespostaFeriados> {
    return this.http.get<RespostaFeriados>(
      `${this.baseUrl}/${ano}`,
    );
  }

  consultar(ano: number): Observable<RespostaFeriados> {
    return this.http.post<RespostaFeriados>(
      `${this.baseUrl}/${ano}/consultar`,
      {},
    );
  }
}