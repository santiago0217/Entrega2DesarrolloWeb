import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Reserva } from '../../../models/reserva.model';
import { hoy } from '../../../services/api';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';
import { SesionService } from '../../../services/sesion.service';

// Equivalente de gerente_agenda.html: reservas de la barbería en un día
@Component({
  selector: 'app-gerente-agenda',
  imports: [FormsModule],
  templateUrl: './gerente-agenda.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerenteAgenda {
  private gerenteService = inject(GerenteService);

  protected readonly barberia = inject(SesionService).usuario()?.barberia?.nombre;
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
    this.gerenteService.agenda(fecha).subscribe({
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
