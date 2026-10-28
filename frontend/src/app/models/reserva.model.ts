import { Espacio } from './espacio.model';
import { Pago } from './pago.model';
import { Ref } from './referencia.model';
import { Servicio } from './servicio.model';
import { Usuario } from './usuario.model';

// Mismos campos que Reserva.java del backend. fecha: "2026-10-27", hora: "14:30:00"
export interface Reserva {
  id: number;
  usuario: Usuario;
  barbero: Usuario;
  servicio: Servicio;
  espacio: Espacio;
  fecha: string;
  hora: string;
}

// Lo que se envía al crear o editar: solo los ids de los registros relacionados
export interface ReservaDatos {
  usuario?: Ref;
  barbero: Ref;
  servicio: Ref;
  espacio: Ref;
  fecha: string;
  hora: string;
}

// Reserva con su pago (null si todavía no se ha pagado)
export interface ReservaConPago {
  reserva: Reserva;
  pago: Pago | null;
}

// Opciones de los selectores del formulario de reserva (ver OpcionesReserva.java)
export interface OpcionesReserva {
  servicio: Servicio | null;
  clientes: Usuario[] | null;
  barberos: Usuario[];
  servicios: Servicio[] | null;
  espacios: Espacio[];
}
