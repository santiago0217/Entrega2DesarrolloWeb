import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Barberia } from '../models/barberia.model';

@Injectable({
  providedIn: 'root',
})
export class BarberiaService {
  private http = inject(HttpClient);
  private readonly url = 'http://localhost:8081/api/barberias';

  listar(): Observable<Barberia[]> {
    return this.http.get<Barberia[]>(this.url);
  }

  obtener(id: number): Observable<Barberia> {
    return this.http.get<Barberia>(`${this.url}/${id}`);
  }

  crear(barberia: Barberia): Observable<Barberia> {
    return this.http.post<Barberia>(this.url, barberia);
  }

  actualizar(id: number, barberia: Barberia): Observable<Barberia> {
    return this.http.put<Barberia>(`${this.url}/${id}`, barberia);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
