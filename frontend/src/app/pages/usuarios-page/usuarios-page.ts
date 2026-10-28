import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UsuarioForm } from '../../components/usuario-form/usuario-form';
import { Barberia } from '../../models/barberia.model';
import { ResumenRol } from '../../models/resumen.model';
import { ROLES, Rol, Usuario } from '../../models/usuario.model';
import { BarberiaService } from '../../services/barberia.service';
import { mensajeError } from '../../services/mensaje-error';
import { UsuarioService } from '../../services/usuario.service';

// Padre del formulario de usuario (equivalente de usuarios.html + vista_usuario.html).
// Envía al hijo el usuario a editar y recibe con (usuarioGuardado) el usuario a guardar.
@Component({
  selector: 'app-usuarios-page',
  imports: [UsuarioForm, FormsModule],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosPage {
  private usuarioService = inject(UsuarioService);
  private barberiaService = inject(BarberiaService);

  protected readonly roles = ROLES;
  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly resumenRoles = signal<ResumenRol[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly aviso = signal('');

  protected readonly rolFiltro = signal<Rol | null>(null);

  // Solo las barberías activas se pueden asignar (como en UsuarioController)
  private readonly barberias = signal<Barberia[]>([]);
  protected readonly barberiasActivas = computed(() => this.barberias().filter((b) => b.activo));

  // null = formulario cerrado; usuario sin id = nuevo
  protected readonly seleccionado = signal<Usuario | null>(null);
  protected readonly formularioAbierto = signal(false);

  constructor() {
    this.cargar();
    this.barberiaService.listar().subscribe((lista) => this.barberias.set(lista));
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.usuarioService.listar(this.rolFiltro()).subscribe({
      next: (lista) => {
        this.usuarios.set(lista);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
    this.usuarioService.resumenRoles().subscribe((r) => this.resumenRoles.set(r));
  }

  verTodos(): void {
    this.rolFiltro.set(null);
    this.cargar();
  }

  nuevo(): void {
    this.aviso.set('');
    this.seleccionado.set(null);
    this.formularioAbierto.set(true);
  }

  editar(usuario: Usuario): void {
    this.aviso.set('');
    this.seleccionado.set(usuario);
    this.formularioAbierto.set(true);
  }

  cerrarFormulario(): void {
    this.formularioAbierto.set(false);
    this.seleccionado.set(null);
  }

  // Recibe el usuario desde el hijo y hace el POST o el PUT
  guardarUsuario(usuario: Usuario): void {
    const peticion = usuario.id
      ? this.usuarioService.actualizar(usuario.id, usuario)
      : this.usuarioService.crear(usuario);
    peticion.subscribe({
      next: (guardado) => {
        this.aviso.set(`Usuario "${guardado.nombre}" guardado`);
        this.cerrarFormulario();
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }

  cambiarEstado(usuario: Usuario): void {
    if (usuario.activo && !confirm(`¿Desactivar a "${usuario.nombre}"?`)) {
      return;
    }
    this.usuarioService.cambiarEstado(usuario.id!, !usuario.activo).subscribe({
      next: () => {
        this.aviso.set(`Usuario "${usuario.nombre}" ${usuario.activo ? 'desactivado' : 'activado'}`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.aviso.set(mensajeError(err)),
    });
  }
}
