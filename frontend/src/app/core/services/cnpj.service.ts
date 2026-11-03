import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EmpresaCnpj } from '../models/empresa-cnpj.model';

@Injectable({
  providedIn: 'root',
})
export class CnpjService {
  private readonly http = inject(HttpClient);

  consultar(cnpj: string): Observable<EmpresaCnpj> {
    return this.http.get<EmpresaCnpj>(
      `/api/v1/cnpj/${encodeURIComponent(cnpj)}`,
    );
  }
}