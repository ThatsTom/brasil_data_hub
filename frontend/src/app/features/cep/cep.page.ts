import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { CepService } from '../../core/services/cep.service';
import { EnderecoCep } from '../../core/models/cep.model';

@Component({
  selector: 'app-cep-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cep.page.html',
  styleUrl: './cep.page.scss'
})
export class CepPage {
  private readonly cepService = inject(CepService);

  readonly cep = signal('');
  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly endereco = signal<EnderecoCep | null>(null);

  consultar(): void {
    const cepLimpo = this.cep().replace(/\D/g, '');

    this.erro.set('');
    this.endereco.set(null);

    if (!/^\d{8}$/.test(cepLimpo)) {
      this.erro.set('Informe um CEP válido com 8 dígitos.');
      return;
    }

    this.carregando.set(true);

    this.cepService.consultar(cepLimpo)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (dados) => {
          this.endereco.set(dados);
        },
        error: (erro: HttpErrorResponse) => {
          if (erro.status === 404) {
            this.erro.set('CEP não encontrado.');
          } else if (erro.status === 503) {
            this.erro.set(
              'Os serviços de consulta estão indisponíveis.'
            );
          } else {
            this.erro.set(
              'Não foi possível consultar o CEP. Tente novamente.'
            );
          }
        }
      });
  }
}