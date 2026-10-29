import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResumenRol } from '../models/resumen.model';
import { Rol, Usuario } from '../models/usuario.model';
import { API_URL } from './api';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/admin/usuarios`;

  listar(rol?: Rol | null): Observable<Usuario[]> {
    const params = rol ? new HttpParams().set('rol', rol) : undefined;
    return this.http.get<Usuario[]>(this.url, { params });
  }

  resumenRoles(): Observable<ResumenRol[]> {
    return this.http.get<ResumenRol[]>(`${this.url}/resumen-roles`);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  cambiarEstado(id: number, activo: boolean): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/${activo ? 'activar' : 'desactivar'}`, null);
  }
}
