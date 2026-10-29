import { Barberia } from './barberia.model';

export interface Espacio {
  id?: number;
  nombre: string;
  capacidad: number;
  activo: boolean;
  barberia: Partial<Barberia> | null;
}
