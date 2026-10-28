import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Pago, PagoDatos } from '../models/pago.model';
import { API_URL } from './api';

// Pagos de todas las barberías, para el administrador (/api/admin/pagos)
@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/admin/pagos`;

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.url);
  }

  obtener(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.url}/${id}`);
  }

  crear(pago: PagoDatos): Observable<Pago> {
    return this.http.post<Pago>(this.url, pago);
  }

  actualizar(id: number, pago: PagoDatos): Observable<Pago> {
    return this.http.put<Pago>(`${this.url}/${id}`, pago);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
