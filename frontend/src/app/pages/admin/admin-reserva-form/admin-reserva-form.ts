import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ReservaForm } from '../../../components/reserva-form/reserva-form';
import { OpcionesReserva, Reserva, ReservaDatos } from '../../../models/reserva.model';
import { mensajeError } from '../../../services/mensaje-error';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-admin-reserva-form',
  imports: [ReservaForm],
  templateUrl: './admin-reserva-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservaForm implements OnInit {
  private reservaService = inject(ReservaService);
  private router = inject(Router);

  id = input<string>();

  protected readonly opciones = signal<OpcionesReserva | null>(null);
  protected readonly registro = signal<Reserva | null>(null);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.reservaService.opciones().subscribe({
      next: (o) => this.opciones.set(o),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
    const id = this.id();
    if (id) {
      this.reservaService.obtener(+id).subscribe({
        next: (r) => this.registro.set(r.reserva),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
    }
  }

  guardar(datos: ReservaDatos): void {
    this.error.set('');
    const id = this.id();
    const peticion = id ? this.reservaService.actualizar(+id, datos) : this.reservaService.crear(datos);
    peticion.subscribe({
      next: () => this.router.navigate(['/admin/reservas']),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  volver(): void {
    this.router.navigate(['/admin/reservas']);
  }
}
