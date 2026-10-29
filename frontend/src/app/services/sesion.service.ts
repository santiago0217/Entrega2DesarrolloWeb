import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { Credenciales, Rol, Usuario } from '../models/usuario.model';
import { API_URL } from './api';

export function rutaInicio(rol: Rol): string {
  switch (rol) {
    case 'ADMINISTRADOR':
      return '/admin';
    case 'GERENTE':
      return '/gerente';
    case 'BARBERO':
      return '/barbero';
    default:
      return '/cliente';
  }
}

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  private http = inject(HttpClient);
  private readonly url = `${API_URL}/auth`;

  private readonly usuarioActual = signal<Usuario | null>(null);

  readonly usuario = this.usuarioActual.asReadonly();
  readonly correo = computed(() => this.usuarioActual()?.correo ?? null);

  login(credenciales: Credenciales): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.url}/login`, credenciales)
      .pipe(tap((usuario) => this.usuarioActual.set(usuario)));
  }

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/registro`, usuario);
  }

  restaurar(): Observable<Usuario | null> {
    const usuario = this.usuarioActual();
    if (usuario) {
      return of(usuario);
    }
    return this.http.get<Usuario>(`${this.url}/sesion`).pipe(
      tap((u) => this.usuarioActual.set(u)),
      catchError(() => of(null)),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.url}/logout`, null).pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
      tap(() => this.limpiar()),
    );
  }

  limpiar(): void {
    this.usuarioActual.set(null);
  }
}
