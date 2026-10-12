import { ChangeDetectionStrategy, Component, computed, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ROLES, Rol, Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  imports: [FormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioForm {
  usuarioGuardado = output<Usuario>();

  protected readonly roles = ROLES;

  protected readonly nombre = signal('');
  protected readonly correo = signal('');
  protected readonly password = signal('');
  protected readonly telefono = signal('');
  protected readonly rol = signal<Rol>('CLIENTE');
  protected readonly activo = signal(true);

  protected readonly intentoGuardar = signal(false);
  protected readonly nombreVacio = computed(() => this.nombre().trim() === '');
  protected readonly correoVacio = computed(() => this.correo().trim() === '');

  guardar(): void {
    this.intentoGuardar.set(true);
    if (this.nombreVacio() || this.correoVacio()) {
      return;
    }

    const usuario: Usuario = {
      nombre: this.nombre().trim(),
      correo: this.correo().trim(),
      password: this.password(),
      telefono: this.telefono().trim(),
      rol: this.rol(),
      activo: this.activo(),
    };
    this.usuarioGuardado.emit(usuario);
    this.limpiar();
  }

  private limpiar(): void {
    this.nombre.set('');
    this.correo.set('');
    this.password.set('');
    this.telefono.set('');
    this.rol.set('CLIENTE');
    this.activo.set(true);
    this.intentoGuardar.set(false);
  }
}
