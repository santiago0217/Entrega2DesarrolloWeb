import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ResumenAdmin } from '../../../models/resumen.model';
import { AdminService } from '../../../services/admin.service';
import { mensajeError } from '../../../services/mensaje-error';

// Equivalente de admin_panel.html
@Component({
  selector: 'app-admin-panel',
  imports: [RouterLink],
  templateUrl: './admin-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanel {
  protected readonly resumen = signal<ResumenAdmin | null>(null);
  protected readonly error = signal('');

  constructor() {
    inject(AdminService)
      .resumen()
      .subscribe({
        next: (r) => this.resumen.set(r),
        error: (err: HttpErrorResponse) => this.error.set(mensajeError(err)),
      });
  }
}
