import { inject, Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import type {
  DashboardFiltros,
  DashboardResposta,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  obterResumo(
    filtros: DashboardFiltros,
  ): Observable<DashboardResposta> {
    let params = new HttpParams();

    if (filtros.periodo !== undefined) {
      params = params.set(
        'periodo',
        String(filtros.periodo),
      );
    }

    if (filtros.inicio) {
      params = params.set(
        'inicio',
        filtros.inicio,
      );
    }

    if (filtros.fim) {
      params = params.set(
        'fim',
        filtros.fim,
      );
    }

    if (filtros.tipo) {
      params = params.set(
        'tipo',
        filtros.tipo,
      );
    }

    return this.http.get<DashboardResposta>(
      '/api/v1/dashboard',
      { params },
    );
  }
}