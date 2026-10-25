import { Barberia } from './barberia.model';

// Entidad A. Mismos campos que Servicio.java del backend.
export interface Servicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  barberia: Barberia;
}
