import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Barberia } from '../../../models/barberia.model';
import { ClienteService } from '../../../services/cliente.service';
import { mensajeError } from '../../../services/mensaje-error';

// Equivalente de cliente_barberias.html: barberías activas
@Component({
  selector: 'app-cliente-barberias',
  imports: [RouterLink],
  templateUrl: './cliente-barberias.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteBarberias {
  protected readonly barberias = signal<Barberia[] | null>(null);
  protected readonly error = signal('');

  constructor() {
    inject(ClienteService)
      .barberias()
      .subscribe({
        next: (lista) => this.barberias.set(lista),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
  }
}
