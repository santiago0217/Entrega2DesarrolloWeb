// Dirección del backend Spring Boot
export const API_URL = 'http://localhost:8081/api';

// Fecha de hoy en formato yyyy-MM-dd (hora local, no UTC)
export function hoy(): string {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}
