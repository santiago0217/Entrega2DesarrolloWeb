import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ReservaForm } from '../../../components/reserva-form/reserva-form';
import { OpcionesReserva, ReservaDatos } from '../../../models/reserva.model';
import { ClienteService } from '../../../services/cliente.service';
import { mensajeError } from '../../../services/mensaje-error';

@Component({
  selector: 'app-cliente-reservar',
  imports: [ReservaForm, CurrencyPipe],
  templateUrl: './cliente-reservar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteReservar implements OnInit {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  servicioId = input.required<string>();

  protected readonly opciones = signal<OpcionesReserva | null>(null);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.clienteService.opcionesReserva(+this.servicioId()).subscribe({
      next: (o) => this.opciones.set(o),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  reservar(datos: ReservaDatos): void {
    this.error.set('');
    this.clienteService.reservar(datos).subscribe({
      next: () => this.router.navigate(['/cliente/reservas']),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  volver(): void {
    const barberiaId = this.opciones()?.servicio?.barberia.id;
    this.router.navigate(barberiaId ? ['/cliente/barberias', barberiaId] : ['/cliente']);
  }
}
