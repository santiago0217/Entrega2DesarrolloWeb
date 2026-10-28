import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Espacio } from '../models/espacio.model';
import { Pago } from '../models/pago.model';
import { Reserva, ReservaConPago } from '../models/reserva.model';
import { ResumenGerente } from '../models/resumen.model';
import { Servicio } from '../models/servicio.model';
import { Usuario } from '../models/usuario.model';
import { API_URL } from './api';

// Todo lo del gerente (/api/gerente). El backend limita cada consulta a su barbería.
@Injectable({
  providedIn: 'root',
})
export class GerenteService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/gerente`;

  resumen(): Observable<ResumenGerente> {
    return this.http.get<ResumenGerente>(`${this.url}/resumen`);
  }

  reservas(): Observable<ReservaConPago[]> {
    return this.http.get<ReservaConPago[]>(`${this.url}/reservas`);
  }

  agenda(fecha: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/agenda`, { params: new HttpParams().set('fecha', fecha) });
  }

  pagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.url}/pagos`);
  }

  servicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.url}/servicios`);
  }

  guardarServicio(servicio: Servicio): Observable<Servicio> {
    return servicio.id
      ? this.http.put<Servicio>(`${this.url}/servicios/${servicio.id}`, servicio)
      : this.http.post<Servicio>(`${this.url}/servicios`, servicio);
  }

  espacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.url}/espacios`);
  }

  guardarEspacio(espacio: Espacio): Observable<Espacio> {
    return espacio.id
      ? this.http.put<Espacio>(`${this.url}/espacios/${espacio.id}`, espacio)
      : this.http.post<Espacio>(`${this.url}/espacios`, espacio);
  }

  barberos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/barberos`);
  }

  guardarBarbero(barbero: Usuario): Observable<Usuario> {
    return barbero.id
      ? this.http.put<Usuario>(`${this.url}/barberos/${barbero.id}`, barbero)
      : this.http.post<Usuario>(`${this.url}/barberos`, barbero);
  }

  // tipo: 'servicios' | 'espacios' | 'barberos'
  cambiarEstado(tipo: string, id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.url}/${tipo}/${id}/${activo ? 'activar' : 'desactivar'}`, null);
  }
}
