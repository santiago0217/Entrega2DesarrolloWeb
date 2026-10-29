import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ESTADOS_PAGO, METODOS_PAGO, Pago, PagoDatos } from '../../models/pago.model';
import { Reserva } from '../../models/reserva.model';

@Component({
  selector: 'app-pago-form',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './pago-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagoForm {
  registro = input<Pago | null>(null);
  reservas = input<Reserva[]>([]);
  reservaFija = input<Reserva | null>(null);
  reservaSeleccionada = input<number | null>(null);
  guardado = output<PagoDatos>();
  cancelado = output<void>();

  protected readonly metodos = METODOS_PAGO;
  protected readonly estados = ESTADOS_PAGO;

  protected readonly reservaId = linkedSignal<number | null>(
    () => this.registro()?.reserva.id ?? this.reservaFija()?.id ?? this.reservaSeleccionada(),
  );
  protected readonly monto = linkedSignal<number | null>(
    () =>
      this.registro()?.monto ??
      this.reservaFija()?.servicio.precio ??
      this.reservas().find((r) => r.id === this.reservaSeleccionada())?.servicio.precio ??
      null,
  );
  protected readonly metodoPago = linkedSignal(() => this.registro()?.metodoPago ?? '');
  protected readonly estado = linkedSignal(() => this.registro()?.estado ?? 'PENDIENTE');

  protected readonly intentoGuardar = signal(false);
  protected readonly montoInvalido = computed(() => !((this.monto() ?? 0) > 0));

  elegirReserva(id: number | null): void {
    this.reservaId.set(id);
    const reserva = this.reservas().find((r) => r.id === id);
    if (reserva) {
      this.monto.set(reserva.servicio.precio);
    }
  }

  guardar(): void {
    this.intentoGuardar.set(true);
    if (this.reservaId() === null || this.montoInvalido() || this.metodoPago() === '') {
      return;
    }
    this.guardado.emit({
      reserva: { id: this.reservaId()! },
      monto: this.monto()!,
      metodoPago: this.metodoPago(),
      estado: this.estado(),
    });
  }

  cancelar(): void {
    this.cancelado.emit();
  }
}
