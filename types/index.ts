export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  icono: string;
}

export interface ProximaCita {
  idCita: number;
  detalles: string;
  fecha: string;
  hora: string;
  estado: string;
  recordar: boolean;
  doctor: DoctorCita;
}

export interface DoctorCita {
  idDoctor: number;
  experiencia: number;
  detalles: string;
  detallesUsuario: DetallesUsuario;
  especialidad: Especialidad;
}

export interface DetallesUsuario {
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

export interface TopDoctor {
  id: number;
  nombre_doctor: string;
  apellido_doctor: string;
  doctor_image: string;
  especialidad: string;
  rating: number;
  number_reviews: number;
}
