export interface Pagina<T> {
  content: T[];
  number: number;
  size: number;
  totalPages: number;
  totalElements: number;
}
