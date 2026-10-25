import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Barberia } from '../../models/barberia.model';
import { Servicio } from '../../models/servicio.model';
import { BarberiaService } from '../../services/barberia.service';
import { mensajeError } from '../../services/mensaje-error';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-form-servicio',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-servicio.html',
  styleUrl: './form-servicio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormServicio {
  private servicioService = inject(ServicioService);
  private barberiaService = inject(BarberiaService);
  private router = inject(Router);

  protected readonly barberias = signal<Barberia[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');

  protected readonly formulario = new FormGroup({
    nombre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    descripcion: new FormControl('', { nonNullable: true }),
    precio: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    barberiaId: new FormControl<number | null>(null, Validators.required),
  });

  constructor() {
    // Barberías para el selector
    this.barberiaService.listar().subscribe({
      next: (lista) => this.barberias.set(lista),
      error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
    });
  }

  // Muestra el error de un campo solo después de que el usuario lo tocó
  protected tieneError(campo: string, validacion: string): boolean {
    const control = this.formulario.get(campo)!;
    return control.touched && control.hasError(validacion);
  }

  guardar(): void {
    if (this.formulario.invalid) {
      return;
    }
    const datos = this.formulario.getRawValue();
    const barberia = this.barberias().find((b) => b.id === datos.barberiaId)!;
    const servicio: Servicio = {
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: datos.precio!,
      activo: true,
      barberia,
    };

    this.cargando.set(true);
    this.error.set('');
    this.servicioService.crear(servicio).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/servicios']);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }
}
