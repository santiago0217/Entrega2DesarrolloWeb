import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { Pago } from '../../../models/pago.model';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';
import { SesionService } from '../../../services/sesion.service';

@Component({
  selector: 'app-gerente-pagos',
  imports: [CurrencyPipe],
  templateUrl: './gerente-pagos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerentePagos {
  protected readonly barberia = inject(SesionService).usuario()?.barberia?.nombre;
  protected readonly pagos = signal<Pago[] | null>(null);
  protected readonly error = signal('');

  protected readonly totalRecaudado = computed(() =>
    (this.pagos() ?? []).filter((p) => p.estado === 'COMPLETADO').reduce((suma, p) => suma + p.monto, 0),
  );

  constructor() {
    inject(GerenteService)
      .pagos()
      .subscribe({
        next: (lista) => this.pagos.set(lista),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
  }
}
