export interface Credenciales {
  correo: string;
  password: string;
}

export const ROLES = ['CLIENTE', 'BARBERO', 'GERENTE', 'ADMINISTRADOR'] as const;

export type Rol = (typeof ROLES)[number];

// Mismos campos que la entidad Usuario.java del backend.
export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password: string;
  telefono: string;
  rol: Rol;
  barberia?: { id: number } | null;
  activo: boolean;
}
