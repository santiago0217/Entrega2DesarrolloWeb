import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Pagina } from '../models/pagina.model';
import { Servicio } from '../models/servicio.model';
import { API_URL } from './api';

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/servicios`;

  listar(
    page: number,
    size: number,
    nombre = '',
    min?: number,
    max?: number,
  ): Observable<Pagina<Servicio>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (nombre.trim() !== '') {
      params = params.set('nombre', nombre.trim());
    }
    if (min !== undefined) {
      params = params.set('min', min);
    }
    if (max !== undefined) {
      params = params.set('max', max);
    }
    return this.http.get<Pagina<Servicio>>(this.url, { params });
  }

  obtener(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.url}/${id}`);
  }

  crear(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.url, servicio);
  }

  actualizar(id: number, servicio: Servicio): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.url}/${id}`, servicio);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
