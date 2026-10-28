import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PagoForm } from '../../../components/pago-form/pago-form';
import { Pago, PagoDatos } from '../../../models/pago.model';
import { Reserva } from '../../../models/reserva.model';
import { mensajeError } from '../../../services/mensaje-error';
import { PagoService } from '../../../services/pago.service';
import { ReservaService } from '../../../services/reserva.service';

// Equivalente de pago_form.html. Ruta /admin/pagos/nuevo?reservaId=3 o /admin/pagos/:id/editar
@Component({
  selector: 'app-admin-pago-form',
  imports: [PagoForm],
  templateUrl: './admin-pago-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPagoForm implements OnInit {
  private pagoService = inject(PagoService);
  private reservaService = inject(ReservaService);
  private router = inject(Router);

  // :id de la ruta y ?reservaId (withComponentInputBinding)
  id = input<string>();
  reservaId = input<string>();

  protected readonly reservas = signal<Reserva[] | null>(null);
  protected readonly registro = signal<Pago | null>(null);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.reservaService.listar().subscribe({
      next: (lista) => this.reservas.set(lista.map((item) => item.reserva)),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
    const id = this.id();
    if (id) {
      this.pagoService.obtener(+id).subscribe({
        next: (p) => this.registro.set(p),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
    }
  }

  protected reservaSeleccionada(): number | null {
    const id = this.reservaId();
    return id ? +id : null;
  }

  guardar(datos: PagoDatos): void {
    this.error.set('');
    const id = this.id();
    const peticion = id ? this.pagoService.actualizar(+id, datos) : this.pagoService.crear(datos);
    peticion.subscribe({
      next: () => this.router.navigate(['/admin/pagos']),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  volver(): void {
    this.router.navigate(['/admin/pagos']);
  }
}
