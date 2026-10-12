import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UsuarioForm } from '../../components/usuario-form/usuario-form';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios-page',
  imports: [UsuarioForm],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuariosPage {
  private usuarioService = inject(UsuarioService);

  protected readonly usuarios = this.usuarioService.obtenerUsuarios();

  guardarUsuario(usuario: Usuario): void {
    this.usuarioService.agregarUsuario(usuario);
  }
}
