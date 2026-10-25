import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Barberia } from '../../models/barberia.model';

@Component({
  selector: 'app-lista-barberia',
  templateUrl: './lista-barberia.html',
  styleUrl: './lista-barberia.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaBarberia {
  // Datos de prueba mientras se conecta el backend
  protected readonly barberias = signal<Barberia[]>([
    {
      id: 1,
      nombre: 'Barberia la 45',
      direccion: 'Calle 45 #12-30, Bogotá',
      telefono: '6012345678',
      horario: 'Lunes a Sábado 9:00 - 19:00',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Chamos Barbershop',
      direccion: 'Carrera 7 #80-15, Bogotá',
      telefono: '6019876543',
      horario: 'Martes a Domingo 10:00 - 20:00',
      activo: true,
    },
    {
      id: 3,
      nombre: 'Barbería del Parque',
      direccion: 'Calle 93 #11-20, Bogotá',
      telefono: '6015554433',
      horario: 'Lunes a Viernes 8:00 - 18:00',
      activo: false,
    },
  ]);
}
