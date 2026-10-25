import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { SesionService } from '../../services/sesion.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Inicio {
  private sesionService = inject(SesionService);

  protected readonly titulo = 'Bienvenido a BarberBook';
  protected readonly usuario = computed(() => this.sesionService.correo() ?? 'invitado');

  // Contador de visitas con signals
  protected readonly visitas = signal(0);

  sumar(): void {
    this.visitas.update((v) => v + 1);
  }

  reiniciar(): void {
    this.visitas.set(0);
  }
}
