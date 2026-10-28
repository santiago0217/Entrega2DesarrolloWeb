import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Servicio } from '../../models/servicio.model';

// Hijo de lista-servicio y gerente-servicios: recibe el servicio con input() y lo devuelve editado
// con output(). Si el servicio no tiene id, el formulario sirve para crear uno nuevo.
@Component({
  selector: 'app-editar-servicio',
  imports: [FormsModule],
  templateUrl: './editar-servicio.html',
  styleUrl: './editar-servicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditarServicio {
  registro = input.required<Servicio>();
  guardado = output<Servicio>();
  cancelado = output<void>();

  // Copias editables; se reinician cuando el padre envía otro registro
  protected readonly nombre = linkedSignal(() => this.registro().nombre);
  protected readonly descripcion = linkedSignal(() => this.registro().descripcion ?? '');
  protected readonly precio = linkedSignal(() => this.registro().precio);
  protected readonly activo = linkedSignal(() => this.registro().activo);

  protected readonly nombreInvalido = computed(() => this.nombre().trim().length < 3);
  protected readonly precioInvalido = computed(() => !(this.precio() >= 1));

  guardar(): void {
    if (this.nombreInvalido() || this.precioInvalido()) {
      return;
    }
    this.guardado.emit({
      ...this.registro(),
      nombre: this.nombre().trim(),
      descripcion: this.descripcion().trim(),
      precio: this.precio(),
      activo: this.activo(),
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
