import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { OpcionesReserva, Reserva, ReservaConPago, ReservaDatos } from '../models/reserva.model';
import { API_URL } from './api';

// Reservas de todas las barberías, para el administrador (/api/admin/reservas)
@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/admin/reservas`;

  listar(usuarioId?: number | null): Observable<ReservaConPago[]> {
    const params = usuarioId ? new HttpParams().set('usuarioId', usuarioId) : undefined;
    return this.http.get<ReservaConPago[]>(this.url, { params });
  }

  opciones(): Observable<OpcionesReserva> {
    return this.http.get<OpcionesReserva>(`${this.url}/opciones`);
  }

  obtener(id: number): Observable<ReservaConPago> {
    return this.http.get<ReservaConPago>(`${this.url}/${id}`);
  }

  crear(reserva: ReservaDatos): Observable<Reserva> {
    return this.http.post<Reserva>(this.url, reserva);
  }

  actualizar(id: number, reserva: ReservaDatos): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.url}/${id}`, reserva);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
