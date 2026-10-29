import { Ref } from './referencia.model';
import { Reserva } from './reserva.model';

export const METODOS_PAGO = ['Efectivo', 'Tarjeta de Crédito', 'Transferencia'] as const;
export const ESTADOS_PAGO = ['PENDIENTE', 'COMPLETADO'] as const;

export interface Pago {
  id?: number;
  reserva: Reserva;
  monto: number;
  metodoPago: string;
  estado: string;
}

export interface PagoDatos {
  reserva: Ref;
  monto: number;
  metodoPago: string;
  estado: string;
}
