import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Barberia } from '../models/barberia.model';
import { Pago, PagoDatos } from '../models/pago.model';
import { OpcionesReserva, Reserva, ReservaConPago, ReservaDatos } from '../models/reserva.model';
import { DetalleBarberia } from '../models/resumen.model';
import { API_URL } from './api';

// Todo lo del cliente (/api/cliente). Las reservas y pagos son siempre los del cliente de la sesión.
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/cliente`;

  barberias(): Observable<Barberia[]> {
    return this.http.get<Barberia[]>(`${this.url}/barberias`);
  }

  barberia(id: number): Observable<DetalleBarberia> {
    return this.http.get<DetalleBarberia>(`${this.url}/barberias/${id}`);
  }

  opcionesReserva(servicioId: number): Observable<OpcionesReserva> {
    return this.http.get<OpcionesReserva>(`${this.url}/reservas/opciones`, {
      params: new HttpParams().set('servicioId', servicioId),
    });
  }

  reservas(): Observable<ReservaConPago[]> {
    return this.http.get<ReservaConPago[]>(`${this.url}/reservas`);
  }

  reserva(id: number): Observable<ReservaConPago> {
    return this.http.get<ReservaConPago>(`${this.url}/reservas/${id}`);
  }

  reservar(reserva: ReservaDatos): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.url}/reservas`, reserva);
  }

  cancelar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/reservas/${id}`);
  }

  pagar(pago: PagoDatos): Observable<Pago> {
    return this.http.post<Pago>(`${this.url}/pagos`, pago);
  }
}
