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

import { OpcionesReserva, Reserva, ReservaDatos } from '../../models/reserva.model';
import { hoy } from '../../services/api';

// Hijo: recibe las opciones de los selectores y la reserva a editar (null = nueva) con input()
// y devuelve los datos con output(). El administrador recibe clientes y servicios para elegir;
// el cliente recibe solo el servicio que eligió.
@Component({
  selector: 'app-reserva-form',
  imports: [FormsModule],
  templateUrl: './reserva-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservaForm {
  opciones = input.required<OpcionesReserva>();
  registro = input<Reserva | null>(null);
  guardado = output<ReservaDatos>();
  cancelado = output<void>();

  protected readonly hoy = hoy();

  protected readonly clienteId = linkedSignal<number | null>(() => this.registro()?.usuario.id ?? null);
  protected readonly servicioId = linkedSignal<number | null>(
    () => this.registro()?.servicio.id ?? this.opciones().servicio?.id ?? null,
  );
  protected readonly barberoId = linkedSignal<number | null>(() => this.registro()?.barbero.id ?? null);
  protected readonly espacioId = linkedSignal<number | null>(() => this.registro()?.espacio.id ?? null);
  protected readonly fecha = linkedSignal(() => this.registro()?.fecha ?? '');
  protected readonly hora = linkedSignal(() => this.registro()?.hora.slice(0, 5) ?? '');

  // Sin barberos o sin espacios no se puede reservar (igual que cliente_reserva_form.html)
  protected readonly sinBarberos = computed(() => this.opciones().barberos.length === 0);
  protected readonly sinEspacios = computed(() => this.opciones().espacios.length === 0);

  protected readonly intentoGuardar = signal(false);
  protected readonly clienteFaltante = computed(
    () => this.opciones().clientes !== null && this.clienteId() === null,
  );
  protected readonly fechaInvalida = computed(() => this.fecha() === '' || this.fecha() < this.hoy);

  guardar(): void {
    this.intentoGuardar.set(true);
    if (
      this.clienteFaltante() ||
      this.servicioId() === null ||
      this.barberoId() === null ||
      this.espacioId() === null ||
      this.fechaInvalida() ||
      this.hora() === ''
    ) {
      return;
    }
    this.guardado.emit({
      usuario: this.clienteId() === null ? undefined : { id: this.clienteId()! },
      servicio: { id: this.servicioId()! },
      barbero: { id: this.barberoId()! },
      espacio: { id: this.espacioId()! },
      fecha: this.fecha(),
      hora: this.hora(),
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
