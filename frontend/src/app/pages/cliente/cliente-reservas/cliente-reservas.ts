import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ReservaConPago } from '../../../models/reserva.model';
import { ClienteService } from '../../../services/cliente.service';
import { mensajeError } from '../../../services/mensaje-error';

@Component({
  selector: 'app-cliente-reservas',
  imports: [RouterLink],
  templateUrl: './cliente-reservas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteReservas {
  private clienteService = inject(ClienteService);

  protected readonly reservas = signal<ReservaConPago[] | null>(null);
  protected readonly error = signal('');
  protected readonly aviso = signal('');

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.clienteService.reservas().subscribe({
      next: (lista) => this.reservas.set(lista),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  cancelar(item: ReservaConPago): void {
    if (!confirm('¿Cancelar esta reserva?')) {
      return;
    }
    this.clienteService.cancelar(item.reserva.id).subscribe({
      next: () => {
        this.aviso.set('Reserva cancelada');
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
