import { Injectable, signal } from '@angular/core';

import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  // Arreglo temporal en memoria; se reemplazará por llamadas HTTP al backend.
  private readonly usuarios = signal<Usuario[]>([]);
  private siguienteId = 1;

  agregarUsuario(usuario: Usuario): void {
    const nuevo: Usuario = { ...usuario, id: usuario.id ?? this.siguienteId++ };
    this.usuarios.update((actuales) => [...actuales, nuevo]);
  }

  obtenerUsuarios() {
    return this.usuarios.asReadonly();
  }
}
