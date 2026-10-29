import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DetalleBarberia } from '../../../models/resumen.model';
import { ClienteService } from '../../../services/cliente.service';
import { mensajeError } from '../../../services/mensaje-error';

@Component({
  selector: 'app-cliente-barberia',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cliente-barberia.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteBarberia implements OnInit {
  private clienteService = inject(ClienteService);

  id = input.required<string>();

  protected readonly detalle = signal<DetalleBarberia | null>(null);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.clienteService.barberia(+this.id()).subscribe({
      next: (d) => this.detalle.set(d),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }
}
