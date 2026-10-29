import { HttpErrorResponse } from '@angular/common/http';

export function mensajeError(error: HttpErrorResponse): string {
  const cuerpo = error.error;
  if (cuerpo && typeof cuerpo === 'object' && !(cuerpo instanceof ProgressEvent)) {
    if (typeof cuerpo.mensaje === 'string') {
      return cuerpo.mensaje;
    }
    if (error.status === 400) {
      const errores = Object.values(cuerpo).filter((v) => typeof v === 'string');
      if (errores.length > 0) {
        return errores.join('. ');
      }
    }
  }
  switch (error.status) {
    case 0:
      return 'No hay conexión con el servidor';
    case 400:
      return 'Los datos enviados no son válidos';
    case 401:
      return 'Debes iniciar sesión';
    case 403:
      return 'No tienes permisos para hacer esto';
    case 404:
      return 'Registro no encontrado';
    case 409:
      return 'No se puede eliminar: el registro está siendo usado por otros datos';
    default:
      return 'Ocurrió un error inesperado';
  }
}
