import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Reserva } from '../models/reserva.model';
import { API_URL } from './api';

// Reservas asignadas al barbero de la sesión (/api/barbero)
@Injectable({
  providedIn: 'root',
})
export class BarberoService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/barbero`;

  reservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/reservas`);
  }

  agenda(fecha: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/agenda`, { params: new HttpParams().set('fecha', fecha) });
  }
}
