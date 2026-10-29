import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';

import { PagoForm } from '../../../components/pago-form/pago-form';
import { PagoDatos } from '../../../models/pago.model';
import { Reserva } from '../../../models/reserva.model';
import { ClienteService } from '../../../services/cliente.service';
import { mensajeError } from '../../../services/mensaje-error';

@Component({
  selector: 'app-cliente-pagar',
  imports: [PagoForm],
  templateUrl: './cliente-pagar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientePagar implements OnInit {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  reservaId = input.required<string>();

  protected readonly reserva = signal<Reserva | null>(null);
  protected readonly yaPagada = signal(false);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.clienteService.reserva(+this.reservaId()).subscribe({
      next: (item) => {
        this.reserva.set(item.reserva);
        this.yaPagada.set(item.pago !== null);
      },
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  pagar(datos: PagoDatos): void {
    this.error.set('');
    this.clienteService.pagar(datos).subscribe({
      next: () => this.router.navigate(['/cliente/reservas']),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  volver(): void {
    this.router.navigate(['/cliente/reservas']);
  }
}
