import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Reserva } from '../../../models/reserva.model';
import { hoy } from '../../../services/api';
import { BarberoService } from '../../../services/barbero.service';
import { mensajeError } from '../../../services/mensaje-error';

// Equivalente de barbero_agenda.html: reservas del barbero en un día
@Component({
  selector: 'app-barbero-agenda',
  imports: [FormsModule],
  templateUrl: './barbero-agenda.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarberoAgenda {
  private barberoService = inject(BarberoService);

  protected readonly fecha = signal(hoy());
  protected readonly fechaConsultada = signal('');
  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');

  constructor() {
    this.consultar();
  }

  consultar(): void {
    const fecha = this.fecha() || hoy();
    this.cargando.set(true);
    this.error.set('');
    this.barberoService.agenda(fecha).subscribe({
      next: (lista) => {
        this.reservas.set(lista);
        this.fechaConsultada.set(fecha);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }
}
