import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ResumenGerente } from '../../../models/resumen.model';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';

// Equivalente de gerente_panel.html
@Component({
  selector: 'app-gerente-panel',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './gerente-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerentePanel {
  protected readonly resumen = signal<ResumenGerente | null>(null);
  protected readonly error = signal('');

  constructor() {
    inject(GerenteService)
      .resumen()
      .subscribe({
        next: (r) => this.resumen.set(r),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
  }
}
