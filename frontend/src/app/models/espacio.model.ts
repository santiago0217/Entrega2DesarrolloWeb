import { Barberia } from './barberia.model';

// Mismos campos que Espacio.java del backend.
export interface Espacio {
  id?: number;
  nombre: string;
  capacidad: number;
  activo: boolean;
  barberia: Partial<Barberia> | null;
}
