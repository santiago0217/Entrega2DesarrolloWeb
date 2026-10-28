import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EditarServicio } from '../../../components/editar-servicio/editar-servicio';
import { Barberia } from '../../../models/barberia.model';
import { Servicio } from '../../../models/servicio.model';
import { GerenteService } from '../../../services/gerente.service';
import { mensajeError } from '../../../services/mensaje-error';
import { SesionService } from '../../../services/sesion.service';

// Equivalente de gerente_servicios.html + gerente_servicio_form.html.
// Reutiliza el hijo editar-servicio para crear y para editar.
@Component({
  selector: 'app-gerente-servicios',
  imports: [CurrencyPipe, EditarServicio],
  templateUrl: './gerente-servicios.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GerenteServicios {
  private gerenteService = inject(GerenteService);
  private readonly miBarberia = inject(SesionService).usuario()?.barberia as Barberia;

  protected readonly barberia = this.miBarberia?.nombre;
  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly seleccionado = signal<Servicio | null>(null);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.gerenteService.servicios().subscribe({
      next: (lista) => {
        this.servicios.set(lista);
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
    this.seleccionado.set({ nombre: '', descripcion: '', precio: 0, activo: true, barberia: this.miBarberia });
  }

  editar(servicio: Servicio): void {
    this.aviso.set('');
    this.seleccionado.set(servicio);
  }

  cerrarFormulario(): void {
    this.seleccionado.set(null);
  }

  guardar(servicio: Servicio): void {
    this.gerenteService.guardarServicio(servicio).subscribe({
      next: (guardado) => {
        this.aviso.set(`Servicio "${guardado.nombre}" guardado`);
        this.cerrarFormulario();
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  cambiarEstado(servicio: Servicio): void {
    if (servicio.activo && !confirm(`¿Desactivar el servicio "${servicio.nombre}"?`)) {
      return;
    }
    this.gerenteService.cambiarEstado('servicios', servicio.id!, !servicio.activo).subscribe({
      next: () => {
        this.aviso.set(`Servicio "${servicio.nombre}" ${servicio.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
