import { HttpErrorResponse } from '@angular/common/http';

// Traduce el status HTTP a un mensaje para el usuario.
export function mensajeError(error: HttpErrorResponse): string {
  switch (error.status) {
    case 0:
      return 'No hay conexión con el servidor';
    case 400:
      return 'Los datos enviados no son válidos';
    case 404:
      return 'Registro no encontrado';
    case 409:
      return 'No se puede eliminar: el registro está siendo usado por otros datos';
    default:
      return 'Ocurrió un error inesperado';
  }
}
