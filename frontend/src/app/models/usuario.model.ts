export interface Credenciales {
  correo: string;
  password: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
  telefono?: string;
  rol?: string;
  activo: boolean;
}
