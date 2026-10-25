import { ChangeDetectionStrategy, Component } from '@angular/core';

// Hijo de lista-servicio: recibirá el servicio a editar y lo devolverá modificado.
@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.html',
  styleUrl: './editar-servicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarServicio {}
