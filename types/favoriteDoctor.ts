// Define esta interfaz en la parte superior de Favorites.tsx o en un archivo de tipos
export interface FavoriteDoctorDTO {
  idFavorito: number;
  idDoctor: number;
  nombre: string; // Ya plano
  apellido: string; // Ya plano
  doctor_image: string | null; // Ya plano
  especialidad: string; // Ya plano
  rating: number; // Ya plano
  number_reviews: number; // Ya plano
}
