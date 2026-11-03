import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnderecoCep } from '../models/cep.model';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  private readonly http = inject(HttpClient);

  consultar(cep: string): Observable<EnderecoCep> {
    return this.http.get<EnderecoCep>(
      `/api/v1/cep/${encodeURIComponent(cep)}`
    );
  }
}