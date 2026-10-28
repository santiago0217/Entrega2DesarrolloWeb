import { Ref } from './referencia.model';
import { Reserva } from './reserva.model';

export const METODOS_PAGO = ['Efectivo', 'Tarjeta de Crédito', 'Transferencia'] as const;
export const ESTADOS_PAGO = ['PENDIENTE', 'COMPLETADO'] as const;

// Mismos campos que Pago.java del backend.
export interface Pago {
  id?: number;
  reserva: Reserva;
  monto: number;
  metodoPago: string;
  estado: string;
}

// Lo que se envía al crear o editar
export interface PagoDatos {
  reserva: Ref;
  monto: number;
  metodoPago: string;
  estado: string;
}
