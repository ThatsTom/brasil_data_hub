import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { CnpjService } from '../../core/services/cnpj.service';
import { EmpresaCnpj } from '../../core/models/empresa-cnpj.model';

@Component({
  selector: 'app-cnpj-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cnpj.page.html',
  styleUrl: './cnpj.page.scss',
})
export class CnpjPage {
  private readonly cnpjService = inject(CnpjService);

  readonly cnpj = signal('');
  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly empresa = signal<EmpresaCnpj | null>(null);

  consultar(): void {
    if (this.carregando()) return;

    const cnpj = this.cnpj()
      .trim()
      .toUpperCase()
      .replace(/[.\-\/\s]/g, '');

    this.erro.set('');
    this.empresa.set(null);

    if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) {
      this.erro.set(
        'Informe um CNPJ válido com 14 caracteres.',
      );
      return;
    }

    this.carregando.set(true);

    this.cnpjService.consultar(cnpj)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (dados) => {
          this.empresa.set(dados);
        },
        error: (erro: HttpErrorResponse) => {
          if (erro.status === 400) {
            this.erro.set(
              erro.error?.message ?? 'CNPJ inválido.',
            );
          } else if (erro.status === 404) {
            this.erro.set(
              'CNPJ não encontrado na base consultada.',
            );
          } else if (erro.status === 429) {
            this.erro.set(
              'Limite de consultas atingido. Tente mais tarde.',
            );
          } else if (erro.status === 503) {
            this.erro.set(
              'O fornecedor está temporariamente indisponível.',
            );
          } else {
            this.erro.set(
              'Não foi possível realizar a consulta.',
            );
          }
        },
      });
  }

  formatarCnpj(cnpj: string): string {
    const valor = cnpj.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    if (valor.length !== 14) return cnpj;

    return `${valor.slice(0, 2)}.${valor.slice(2, 5)}.${valor.slice(5, 8)}/${valor.slice(8, 12)}-${valor.slice(12)}`;
  }

  formatarData(data: string | null): string {
    if (!data) return 'Não informada';

    const partes = data.slice(0, 10).split('-');

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  formatarMoeda(valor: number | null): string {
    if (valor === null) return 'Não informado';

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }
}