export interface Doctor {
  idDoctor: number;
  experiencia: number;
  detalles: string;
  detallesUsuario: DetallesUsuario;
  especialidad: Especialidad;
  galeria: Galeria;
}

interface GaleriaSolo {
  idGaleria: number;
}

interface Galeria {
  idGaleria: number;
  imagenes: Imagenes[];
}

interface Imagenes {
  idImagen: number;
  urlImagen: string;
  galeria: GaleriaSolo;
}

interface DetallesUsuario {
  idDetalleUsuario: number;
  nombre: string;
  apellido: string;
  gmail: string;
  fechaNacimiento: string;
  telefono: string;
  genero: string;
  urlImagen: string;
  direccion: string;
}

interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  icono: string;
}
