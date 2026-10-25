import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Pagina } from '../../models/pagina.model';
import { Servicio } from '../../models/servicio.model';
import { mensajeError } from '../../services/mensaje-error';
import { ServicioService } from '../../services/servicio.service';
import { EditarServicio } from '../editar-servicio/editar-servicio';

@Component({
  selector: 'app-lista-servicio',
  imports: [FormsModule, RouterLink, CurrencyPipe, UpperCasePipe, EditarServicio],
  templateUrl: './lista-servicio.html',
  styleUrl: './lista-servicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaServicio {
  private servicioService = inject(ServicioService);

  protected readonly servicios = signal<Servicio[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal(''); // error al cargar la lista
  protected readonly aviso = signal(''); // resultado de editar o eliminar

  // Paginación (el backend cuenta las páginas desde 0)
  private readonly tamano = 5;
  protected readonly pagina = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly total = signal(0);

  // Buscador por nombre y selector de filtro (two-way binding)
  protected readonly nombre = signal('');
  protected readonly filtroPrecio = signal('todos');
  protected readonly letrasEscritas = signal(0);

  // Registro que se envía al hijo editar-servicio
  protected readonly seleccionado = signal<Servicio | null>(null);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    const [min, max] = this.rangoPrecio();
    this.cargando.set(true);
    this.error.set('');

    this.servicioService.listar(this.pagina(), this.tamano, this.nombre(), min, max).subscribe({
      next: (respuesta: Pagina<Servicio>) => {
        this.servicios.set(respuesta.content);
        this.totalPaginas.set(respuesta.totalPages);
        this.total.set(respuesta.totalElements);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  buscar(): void {
    this.pagina.set(0);
    this.cargar();
  }

  contarLetras(evento: Event): void {
    this.letrasEscritas.set((evento.target as HTMLInputElement).value.length);
  }

  anterior(): void {
    this.pagina.update((p) => p - 1);
    this.cargar();
  }

  siguiente(): void {
    this.pagina.update((p) => p + 1);
    this.cargar();
  }

  editar(servicio: Servicio): void {
    this.aviso.set('');
    this.seleccionado.set(servicio);
  }

  cancelarEdicion(): void {
    this.seleccionado.set(null);
  }

  // Recibe el servicio modificado desde el hijo y hace el PUT
  actualizar(servicio: Servicio): void {
    this.cargando.set(true);
    this.servicioService.actualizar(servicio.id!, servicio).subscribe({
      next: () => {
        this.seleccionado.set(null);
        this.aviso.set('Servicio actualizado');
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  eliminar(servicio: Servicio): void {
    if (!confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) {
      return;
    }
    this.cargando.set(true);
    this.servicioService.eliminar(servicio.id!).subscribe({
      next: () => {
        // Si era el último de la página, se vuelve a la anterior
        if (this.servicios().length === 1 && this.pagina() > 0) {
          this.pagina.update((p) => p - 1);
        }
        this.aviso.set('Servicio eliminado');
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  private rangoPrecio(): [number | undefined, number | undefined] {
    switch (this.filtroPrecio()) {
      case 'economicos':
        return [0, 25000];
      case 'premium':
        return [25001, undefined];
      default:
        return [undefined, undefined];
    }
  }
}
