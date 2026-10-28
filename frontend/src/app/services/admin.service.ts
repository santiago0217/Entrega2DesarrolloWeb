import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResumenAdmin, ResumenBarberia } from '../models/resumen.model';
import { API_URL } from './api';

// Panel y reportes del administrador (/api/admin)
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/admin`;

  resumen(): Observable<ResumenAdmin> {
    return this.http.get<ResumenAdmin>(`${this.url}/resumen`);
  }

  reportes(minimo: number): Observable<ResumenBarberia[]> {
    return this.http.get<ResumenBarberia[]>(`${this.url}/reportes`, {
      params: new HttpParams().set('minimo', minimo),
    });
  }
}
