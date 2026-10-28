import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Espacio } from '../models/espacio.model';
import { API_URL } from './api';

// Espacios de todas las barberías, para el administrador (/api/admin/espacios)
@Injectable({
  providedIn: 'root',
})
export class EspacioService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/admin/espacios`;

  listar(capacidadMinima?: number | null): Observable<Espacio[]> {
    const params = capacidadMinima ? new HttpParams().set('capacidadMinima', capacidadMinima) : undefined;
    return this.http.get<Espacio[]>(this.url, { params });
  }

  crear(espacio: Espacio): Observable<Espacio> {
    return this.http.post<Espacio>(this.url, espacio);
  }

  actualizar(id: number, espacio: Espacio): Observable<Espacio> {
    return this.http.put<Espacio>(`${this.url}/${id}`, espacio);
  }

  cambiarEstado(id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/${activo ? 'activar' : 'desactivar'}`, null);
  }
}
