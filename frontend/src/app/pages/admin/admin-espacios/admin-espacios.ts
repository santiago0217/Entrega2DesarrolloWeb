import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EspacioForm } from '../../../components/espacio-form/espacio-form';
import { Barberia } from '../../../models/barberia.model';
import { Espacio } from '../../../models/espacio.model';
import { BarberiaService } from '../../../services/barberia.service';
import { EspacioService } from '../../../services/espacio.service';
import { mensajeError } from '../../../services/mensaje-error';

// Equivalente de espacios.html + espacio_form.html
@Component({
  selector: 'app-admin-espacios',
  imports: [FormsModule, EspacioForm],
  templateUrl: './admin-espacios.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEspacios {
  private espacioService = inject(EspacioService);

  protected readonly espacios = signal<Espacio[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');
  protected readonly capacidadMinima = signal<number | null>(null);

  private readonly barberias = signal<Barberia[]>([]);
  protected readonly barberiasActivas = computed(() => this.barberias().filter((b) => b.activo));

  protected readonly formularioAbierto = signal(false);
  protected readonly seleccionado = signal<Espacio | null>(null);

  constructor() {
    this.cargar();
    inject(BarberiaService)
      .listar()
      .subscribe((lista) => this.barberias.set(lista));
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.espacioService.listar(this.capacidadMinima()).subscribe({
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

  verTodos(): void {
    this.capacidadMinima.set(null);
    this.cargar();
  }

  nuevo(): void {
    this.seleccionado.set(null);
    this.formularioAbierto.set(true);
  }

  editar(espacio: Espacio): void {
    this.seleccionado.set(espacio);
    this.formularioAbierto.set(true);
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
    this.seleccionado.set(null);
  }

  guardar(espacio: Espacio): void {
    const peticion = espacio.id
      ? this.espacioService.actualizar(espacio.id, espacio)
      : this.espacioService.crear(espacio);
    peticion.subscribe({
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
    this.espacioService.cambiarEstado(espacio.id!, !espacio.activo).subscribe({
      next: () => {
        this.aviso.set(`Espacio "${espacio.nombre}" ${espacio.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
