import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EspacioForm } from '../../../components/espacio-form/espacio-form';
import { Espacio } from '../../../models/espacio.model';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';
import { SesionService } from '../../../services/sesion.service';

// Equivalente de gerente_espacios.html + gerente_espacio_form.html
@Component({
  selector: 'app-gerente-espacios',
  imports: [EspacioForm],
  templateUrl: './gerente-espacios.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerenteEspacios {
  private gerenteService = inject(GerenteService);

  protected readonly barberia = inject(SesionService).usuario()?.barberia?.nombre;
  protected readonly espacios = signal<Espacio[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly formularioAbierto = signal(false);
  protected readonly seleccionado = signal<Espacio | null>(null);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.gerenteService.espacios().subscribe({
      next: (lista) => {
        this.espacios.set(lista);
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

  editar(espacio: Espacio): void {
    this.aviso.set('');
    this.seleccionado.set(espacio);
    this.formularioAbierto.set(true);
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
    this.seleccionado.set(null);
  }

  guardar(espacio: Espacio): void {
    this.gerenteService.guardarEspacio(espacio).subscribe({
      next: (guardado) => {
        this.aviso.set(`Espacio "${guardado.nombre}" guardado`);
        this.cerrarFormulario();
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  cambiarEstado(espacio: Espacio): void {
    if (espacio.activo && !confirm(`¿Desactivar el espacio "${espacio.nombre}"?`)) {
      return;
    }
    this.gerenteService.cambiarEstado('espacios', espacio.id!, !espacio.activo).subscribe({
      next: () => {
        this.aviso.set(`Espacio "${espacio.nombre}" ${espacio.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
