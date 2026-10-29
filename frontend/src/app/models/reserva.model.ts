import { Espacio } from './espacio.model';
import { Pago } from './pago.model';
import { Ref } from './referencia.model';
import { Servicio } from './servicio.model';
import { Usuario } from './usuario.model';

export interface Reserva {
  id: number;
  usuario: Usuario;
  barbero: Usuario;
  servicio: Servicio;
  espacio: Espacio;
  fecha: string;
  hora: string;
}

export interface ReservaDatos {
  usuario?: Ref;
  barbero: Ref;
  servicio: Ref;
  espacio: Ref;
  fecha: string;
  hora: string;
}

export interface ReservaConPago {
  reserva: Reserva;
  pago: Pago | null;
}

export interface OpcionesReserva {
  servicio: Servicio | null;
  clientes: Usuario[] | null;
  barberos: Usuario[];
  servicios: Servicio[] | null;
  espacios: Espacio[];
}
