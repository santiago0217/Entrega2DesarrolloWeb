import { Barberia } from './barberia.model';

export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  barberia: Barberia;
}
