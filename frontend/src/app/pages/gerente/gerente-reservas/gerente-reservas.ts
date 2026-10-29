import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ReservaConPago } from '../../../models/reserva.model';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';
import { SesionService } from '../../../services/sesion.service';

@Component({
  selector: 'app-gerente-reservas',
  imports: [RouterLink],
  templateUrl: './gerente-reservas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerenteReservas {
  protected readonly barberia = inject(SesionService).usuario()?.barberia?.nombre;
  protected readonly reservas = signal<ReservaConPago[] | null>(null);
  protected readonly error = signal('');

  constructor() {
    inject(GerenteService)
      .reservas()
      .subscribe({
        next: (lista) => this.reservas.set(lista),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
  }
}
