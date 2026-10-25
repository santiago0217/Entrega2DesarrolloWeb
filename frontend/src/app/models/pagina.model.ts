// Campos que usamos del objeto Page que devuelve Spring Boot.
export interface Pagina<T> {
  content: T[];
  number: number; // página actual (empieza en 0)
  size: number;
  totalPages: number;
  totalElements: number;
}
