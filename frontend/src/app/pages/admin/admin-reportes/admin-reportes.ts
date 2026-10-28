import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ResumenBarberia } from '../../../models/resumen.model';
import { AdminService } from '../../../services/admin.service';
import { mensajeError } from '../../../services/mensaje-error';

// Equivalente de admin_reportes.html: barberías con ingresos (pagos COMPLETADOS) mayores al mínimo
@Component({
  selector: 'app-admin-reportes',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './admin-reportes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReportes {
  private adminService = inject(AdminService);

  protected readonly minimo = signal<number | null>(100000);
  protected readonly resumen = signal<ResumenBarberia[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');

  constructor() {
    this.consultar();
  }

  consultar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.adminService.reportes(this.minimo() ?? 0).subscribe({
      next: (r) => {
        this.resumen.set(r);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(mensajeError(err));
        this.cargando.set(false);
      },
    });
  }
}
