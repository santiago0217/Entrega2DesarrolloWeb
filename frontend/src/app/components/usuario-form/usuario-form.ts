import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Barberia } from '../../models/barberia.model';
import { ROLES, Rol, Usuario } from '../../models/usuario.model';

// Hijo: recibe el usuario a editar con input() (null = nuevo) y devuelve el usuario con output().
// Lo usan UsuariosPage (administrador), GerenteBarberos y RegistroPage.
@Component({
  selector: 'app-usuario-form',
  imports: [FormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioForm {
  registro = input<Usuario | null>(null);
  titulo = input<string>('');
  roles = input<readonly Rol[]>(ROLES);
  barberias = input<Barberia[]>([]);
  usuarioGuardado = output<Usuario>();
  cancelado = output<void>();

  protected readonly editando = computed(() => this.registro()?.id !== undefined);

  // Copias editables; se reinician cuando el padre envía otro registro
  protected readonly nombre = linkedSignal(() => this.registro()?.nombre ?? '');
  protected readonly correo = linkedSignal(() => this.registro()?.correo ?? '');
  protected readonly password = linkedSignal(() => '');
  protected readonly telefono = linkedSignal(() => this.registro()?.telefono ?? '');
  protected readonly rol = linkedSignal<Rol>(() => this.registro()?.rol ?? this.roles()[0]);
  protected readonly barberiaId = linkedSignal<number | null>(() => this.registro()?.barberia?.id ?? null);
  protected readonly activo = linkedSignal(() => this.registro()?.activo ?? true);

  // Barberos y gerentes trabajan en una barbería (misma regla que UsuarioController)
  protected readonly pideBarberia = computed(
    () => this.barberias().length > 0 && (this.rol() === 'BARBERO' || this.rol() === 'GERENTE'),
  );

  // Mismas validaciones que Usuario.java
  protected readonly intentoGuardar = signal(false);
  protected readonly nombreVacio = computed(() => this.nombre().trim() === '');
  protected readonly nombreInvalido = computed(
    () => !this.nombreVacio() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.nombre().trim()),
  );
  protected readonly correoVacio = computed(() => this.correo().trim() === '');
  protected readonly correoInvalido = computed(
    () => !this.correoVacio() && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[cC][oO][mM]$/.test(this.correo().trim()),
  );
  // Al editar, la contraseña vacía significa "conservar la actual"
  protected readonly passwordInvalido = computed(
    () => (!this.editando() || this.password() !== '') && this.password().length < 4,
  );
  protected readonly telefonoInvalido = computed(() => !/^[0-9]{7,15}$/.test(this.telefono().trim()));
  protected readonly barberiaFaltante = computed(() => this.pideBarberia() && this.barberiaId() === null);

  guardar(): void {
    this.intentoGuardar.set(true);
    if (
      this.nombreVacio() ||
      this.nombreInvalido() ||
      this.correoVacio() ||
      this.correoInvalido() ||
      this.passwordInvalido() ||
      this.telefonoInvalido() ||
      this.barberiaFaltante()
    ) {
      return;
    }

    const usuario: Usuario = {
      id: this.registro()?.id,
      nombre: this.nombre().trim(),
      correo: this.correo().trim(),
      password: this.password(),
      telefono: this.telefono().trim(),
      rol: this.rol(),
      barberia: this.pideBarberia() ? { id: this.barberiaId()! } : null,
      activo: this.activo(),
    };
    this.usuarioGuardado.emit(usuario);
    if (!this.editando()) {
      this.limpiar();
    }
  }

  cancelar(): void {
    this.cancelado.emit();
  }

  private limpiar(): void {
    this.nombre.set('');
    this.correo.set('');
    this.password.set('');
    this.telefono.set('');
    this.rol.set(this.roles()[0]);
    this.barberiaId.set(null);
    this.activo.set(true);
    this.intentoGuardar.set(false);
  }
}
