export interface Doctor {
  idDoctor: number;
  nombre: string;
  apellido: string;
  doctor_image: string | null;
  especialidad: string;
  rating: number;
  number_reviews: number;
}

export interface PaginatedResponse {
  content: Doctor[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  itemsPerPage: number;
}
