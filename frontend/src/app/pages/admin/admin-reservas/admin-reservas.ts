import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ReservaConPago } from '../../../models/reserva.model';
import { Usuario } from '../../../models/usuario.model';
import { mensajeError } from '../../../services/mensaje-error';
import { ReservaService } from '../../../services/reserva.service';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-admin-reservas',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-reservas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservas {
  private reservaService = inject(ReservaService);

  protected readonly reservas = signal<ReservaConPago[]>([]);
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly usuarioId = signal<number | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');

  constructor() {
    this.cargar();
    inject(UsuarioService)
      .listar()
      .subscribe((lista) => this.usuarios.set(lista));
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.reservaService.listar(this.usuarioId()).subscribe({
      next: (lista) => {
        this.reservas.set(lista);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  verTodas(): void {
    this.usuarioId.set(null);
    this.cargar();
  }

  eliminar(item: ReservaConPago): void {
    if (!confirm(`¿Eliminar la reserva #${item.reserva.id}?`)) {
      return;
    }
    this.reservaService.eliminar(item.reserva.id).subscribe({
      next: () => {
        this.aviso.set(`Reserva #${item.reserva.id} eliminada`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
