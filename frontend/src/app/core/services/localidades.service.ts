import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  FiltrosMunicipios,
  RespostaEstados,
  RespostaMunicipios,
} from '../models/localidade.model';

@Injectable({
  providedIn: 'root',
})
export class LocalidadesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/localidades';

  listarEstados(): Observable<RespostaEstados> {
    return this.http.get<RespostaEstados>(
      `${this.baseUrl}/estados`,
    );
  }

  listarMunicipios(
    uf: string,
    filtros: FiltrosMunicipios,
  ): Observable<RespostaMunicipios> {
    const params = new HttpParams()
      .set('busca', filtros.busca)
      .set('pagina', String(filtros.pagina))
      .set('limite', String(filtros.limite));

    return this.http.get<RespostaMunicipios>(
      `${this.baseUrl}/estados/${encodeURIComponent(uf)}/municipios`,
      { params },
    );
  }

  pesquisarMunicipios(
    uf: string,
    filtros: FiltrosMunicipios,
  ): Observable<RespostaMunicipios> {
    return this.http.post<RespostaMunicipios>(
      `${this.baseUrl}/estados/${encodeURIComponent(uf)}/municipios/pesquisar`,
      filtros,
    );
  }
}