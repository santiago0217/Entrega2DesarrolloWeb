import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Pago } from '../../../models/pago.model';
import { mensajeError } from '../../../services/mensaje-error';
import { PagoService } from '../../../services/pago.service';

@Component({
  selector: 'app-admin-pagos',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-pagos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPagos {
  private pagoService = inject(PagoService);

  protected readonly pagos = signal<Pago[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.pagoService.listar().subscribe({
      next: (lista) => {
        this.pagos.set(lista);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  eliminar(pago: Pago): void {
    if (!confirm(`¿Eliminar el pago #${pago.id}?`)) {
      return;
    }
    this.pagoService.eliminar(pago.id!).subscribe({
      next: () => {
        this.aviso.set(`Pago #${pago.id} eliminado`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
