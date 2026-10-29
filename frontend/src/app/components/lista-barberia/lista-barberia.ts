import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Barberia } from '../../models/barberia.model';
import { BarberiaService } from '../../services/barberia.service';
import { mensajeError } from '../../services/mensaje-error';

@Component({
  selector: 'app-lista-barberia',
  imports: [FormsModule],
  templateUrl: './lista-barberia.html',
  styleUrl: './lista-barberia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaBarberia {
  private barberiaService = inject(BarberiaService);

  protected readonly barberias = signal<Barberia[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');

  protected readonly idBuscado = signal<number | null>(null);
  protected readonly encontrada = signal<Barberia | null>(null);
  protected readonly errorConsulta = signal('');

  protected readonly editando = signal<Barberia | null>(null);
  protected readonly nombre = signal('');
  protected readonly direccion = signal('');
  protected readonly telefono = signal('');
  protected readonly horario = signal('');
  protected readonly formularioIncompleto = computed(
    () =>
      this.nombre().trim() === '' ||
      this.direccion().trim() === '' ||
      this.telefono().trim() === '' ||
      this.horario().trim() === '',
  );

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.barberiaService.listar().subscribe({
      next: (lista) => {
        this.barberias.set(lista);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  consultar(): void {
    const id = this.idBuscado();
    if (id === null) {
      return;
    }
    this.encontrada.set(null);
    this.errorConsulta.set('');
    this.barberiaService.obtener(id).subscribe({
      next: (barberia) => this.encontrada.set(barberia),
      error: (err: HttpErrorResponse) => this.errorConsulta.set(mensajeError(err)),
    });
  }

  guardar(): void {
    if (this.formularioIncompleto()) {
      return;
    }
    const editando = this.editando();
    const datos: Barberia = {
      nombre: this.nombre().trim(),
      direccion: this.direccion().trim(),
      telefono: this.telefono().trim(),
      horario: this.horario().trim(),
      activo: editando?.activo ?? true,
    };
    const peticion = editando
      ? this.barberiaService.actualizar(editando.id!, datos)
      : this.barberiaService.crear(datos);
    peticion.subscribe({
      next: (guardada) => {
        this.aviso.set(`Barbería "${guardada.nombre}" ${editando ? 'actualizada' : 'creada'}`);
        this.limpiarFormulario();
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  editar(barberia: Barberia): void {
    this.aviso.set('');
    this.editando.set(barberia);
    this.nombre.set(barberia.nombre);
    this.direccion.set(barberia.direccion);
    this.telefono.set(barberia.telefono);
    this.horario.set(barberia.horario);
  }

  cambiarEstado(barberia: Barberia): void {
    const cambiada: Barberia = { ...barberia, activo: !barberia.activo };
    this.barberiaService.actualizar(barberia.id!, cambiada).subscribe({
      next: () => {
        this.aviso.set(`Barbería "${barberia.nombre}" actualizada`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  eliminar(barberia: Barberia): void {
    if (!confirm(`¿Eliminar la barbería "${barberia.nombre}"?`)) {
      return;
    }
    this.barberiaService.eliminar(barberia.id!).subscribe({
      next: () => {
        this.aviso.set(`Barbería "${barberia.nombre}" eliminada`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  limpiarFormulario(): void {
    this.editando.set(null);
    this.nombre.set('');
    this.direccion.set('');
    this.telefono.set('');
    this.horario.set('');
  }
}
