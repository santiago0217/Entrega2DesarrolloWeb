import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ReservaConPago } from '../../../models/reserva.model';
import { mensajeError } from '../../../services/mensaje-error';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-admin-reserva-detalle',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './admin-reserva-detalle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservaDetalle implements OnInit {
  private reservaService = inject(ReservaService);

  id = input.required<string>();

  protected readonly detalle = signal<ReservaConPago | null>(null);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.reservaService.obtener(+this.id()).subscribe({
      next: (d) => this.detalle.set(d),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }
}
