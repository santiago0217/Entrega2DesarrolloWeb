import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { UsuarioForm } from '../../../components/usuario-form/usuario-form';
import { Rol, Usuario } from '../../../models/usuario.model';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';
import { SesionService } from '../../../services/sesion.service';

// Equivalente de gerente_barberos.html + gerente_barbero_form.html.
// Reutiliza el hijo usuario-form con el rol fijo BARBERO; la barbería la pone el backend.
@Component({
  selector: 'app-gerente-barberos',
  imports: [UsuarioForm],
  templateUrl: './gerente-barberos.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerenteBarberos {
  private gerenteService = inject(GerenteService);

  protected readonly roles: readonly Rol[] = ['BARBERO'];
  protected readonly barberia = inject(SesionService).usuario()?.barberia?.nombre;
  protected readonly barberos = signal<Usuario[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly formularioAbierto = signal(false);
  protected readonly seleccionado = signal<Usuario | null>(null);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.gerenteService.barberos().subscribe({
      next: (lista) => {
        this.barberos.set(lista);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  nuevo(): void {
    this.aviso.set('');
    this.seleccionado.set(null);
    this.formularioAbierto.set(true);
  }

  editar(barbero: Usuario): void {
    this.aviso.set('');
    this.seleccionado.set(barbero);
    this.formularioAbierto.set(true);
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
    this.seleccionado.set(null);
  }

  guardar(barbero: Usuario): void {
    this.gerenteService.guardarBarbero(barbero).subscribe({
      next: (guardado) => {
        this.aviso.set(`Barbero "${guardado.nombre}" guardado`);
        this.cerrarFormulario();
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  cambiarEstado(barbero: Usuario): void {
    if (barbero.activo && !confirm(`¿Desactivar a "${barbero.nombre}"?`)) {
      return;
    }
    this.gerenteService.cambiarEstado('barberos', barbero.id!, !barbero.activo).subscribe({
      next: () => {
        this.aviso.set(`Barbero "${barbero.nombre}" ${barbero.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
