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
import { Espacio } from '../../models/espacio.model';

// Hijo: recibe el espacio con input() (null = nuevo) y lo devuelve con output().
// El administrador envía la lista de barberías para elegir; el gerente no (usa la suya).
@Component({
  selector: 'app-espacio-form',
  imports: [FormsModule],
  templateUrl: './espacio-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EspacioForm {
  registro = input<Espacio | null>(null);
  barberias = input<Barberia[]>([]);
  guardado = output<Espacio>();
  cancelado = output<void>();

  protected readonly editando = computed(() => this.registro()?.id !== undefined);

  protected readonly nombre = linkedSignal(() => this.registro()?.nombre ?? '');
  protected readonly capacidad = linkedSignal<number | null>(() => this.registro()?.capacidad ?? 1);
  protected readonly barberiaId = linkedSignal<number | null>(() => this.registro()?.barberia?.id ?? null);
  protected readonly activo = linkedSignal(() => this.registro()?.activo ?? true);

  protected readonly intentoGuardar = signal(false);
  protected readonly nombreVacio = computed(() => this.nombre().trim() === '');
  protected readonly capacidadInvalida = computed(() => !((this.capacidad() ?? 0) >= 1));
  protected readonly barberiaFaltante = computed(
    () => this.barberias().length > 0 && this.barberiaId() === null,
  );

  guardar(): void {
    this.intentoGuardar.set(true);
    if (this.nombreVacio() || this.capacidadInvalida() || this.barberiaFaltante()) {
      return;
    }
    this.guardado.emit({
      id: this.registro()?.id,
      nombre: this.nombre().trim(),
      capacidad: this.capacidad()!,
      activo: this.activo(),
      barberia: this.barberiaId() === null ? null : { id: this.barberiaId()! },
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
