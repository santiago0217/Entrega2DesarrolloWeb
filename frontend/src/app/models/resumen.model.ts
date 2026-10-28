import { Barberia } from './barberia.model';
import { Servicio } from './servicio.model';
import { Rol, Usuario } from './usuario.model';

// Respuestas de los paneles y reportes (ver el paquete dto del backend)
export interface ResumenAdmin {
  totalBarberias: number;
  totalUsuarios: number;
  totalBarberos: number;
  totalServicios: number;
  totalReservas: number;
}

export interface ResumenGerente {
  barberia: Barberia;
  totalBarberos: number;
  totalServicios: number;
  totalEspacios: number;
  totalReservas: number;
  totalRecaudado: number;
}

export interface ResumenBarberia {
  nombre: string;
  total: number;
}

export interface ResumenRol {
  rol: Rol;
  total: number;
}

export interface DetalleBarberia {
  barberia: Barberia;
  servicios: Servicio[];
  barberos: Usuario[];
}
