import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-lista-servicio',
  imports: [FormsModule, RouterLink],
  templateUrl: './lista-servicio.html',
  styleUrl: './lista-servicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaServicio {
  // Datos de prueba mientras se conecta el backend
  protected readonly servicios = signal<Servicio[]>([
    {
      id: 1,
      nombre: 'Corte Clásico',
      descripcion: 'Corte con tijera o máquina',
      precio: 25000,
      activo: true,
      barberia: { id: 1, nombre: 'Barberia la 45', direccion: '', telefono: '', horario: '', activo: true },
    },
    {
      id: 2,
      nombre: 'Corte y Barba',
      descripcion: 'Corte completo más perfilado de barba',
      precio: 40000,
      activo: true,
      barberia: { id: 1, nombre: 'Barberia la 45', direccion: '', telefono: '', horario: '', activo: true },
    },
    {
      id: 3,
      nombre: 'Masaje Capilar',
      descripcion: 'Masaje relajante con aceites',
      precio: 15000,
      activo: false,
      barberia: { id: 2, nombre: 'Chamos Barbershop', direccion: '', telefono: '', horario: '', activo: true },
    },
  ]);

  protected readonly total = computed(() => this.servicios().length);

  // Buscador por nombre y selector de filtro (two-way binding)
  protected readonly nombre = signal('');
  protected readonly filtroPrecio = signal('todos');

  protected readonly letrasEscritas = signal(0);

  contarLetras(evento: Event): void {
    this.letrasEscritas.set((evento.target as HTMLInputElement).value.length);
  }
}
