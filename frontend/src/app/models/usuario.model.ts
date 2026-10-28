import { Barberia } from './barberia.model';

export interface Credenciales {
  correo: string;
  password: string;
}

export const ROLES = ['CLIENTE', 'BARBERO', 'GERENTE', 'ADMINISTRADOR'] as const;

export type Rol = (typeof ROLES)[number];

// Mismos campos que la entidad Usuario.java del backend.
// El backend nunca devuelve la contraseña; al editar, si va vacía se conserva la actual.
export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  rol: Rol;
  barberia?: Partial<Barberia> | null;
  activo: boolean;
}
