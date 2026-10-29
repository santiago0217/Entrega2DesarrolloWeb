import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Reserva } from '../../../models/reserva.model';
import { BarberoService } from '../../../services/barbero.service';
import { mensajeError } from '../../../services/mensaje-error';

@Component({
  selector: 'app-barbero-reservas',
  imports: [RouterLink],
  templateUrl: './barbero-reservas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarberoReservas {
  protected readonly reservas = signal<Reserva[] | null>(null);
  protected readonly error = signal('');

  constructor() {
    inject(BarberoService)
      .reservas()
      .subscribe({
        next: (lista) => this.reservas.set(lista),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
  }
}
