import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  // Solo se recuerda el correo para el saludo; la contraseña nunca se guarda.
  private readonly correoActual = signal<string | null>(null);

  readonly correo = this.correoActual.asReadonly();

  iniciar(correo: string): void {
    this.correoActual.set(correo);
  }
}
