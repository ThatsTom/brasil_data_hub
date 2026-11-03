import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ConsultasResponse,
  FiltrosConsultas,
} from '../models/consulta.model';

@Injectable({
  providedIn: 'root',
})
export class ConsultasService {
  private readonly http = inject(HttpClient);

  listar(filtros: FiltrosConsultas): Observable<ConsultasResponse> {
    let params = new HttpParams()
      .set('pagina', filtros.pagina.toString())
      .set('limite', filtros.limite.toString());

    const opcionais = [
      'busca',
      'tipo',
      'status',
      'dataInicio',
      'dataFim',
    ] as const;

    for (const campo of opcionais) {
      if (filtros[campo]) {
        params = params.set(campo, filtros[campo]);
      }
    }

    return this.http.get<ConsultasResponse>(
      '/api/v1/consultas',
      { params },
    );
  }
}