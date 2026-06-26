export interface OpcionPersonalizada {
  nombre: string;
  valores: string[];
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagenes: string[];
  cupos: number;
  disponible: boolean;
  duracionMinutos: number;
  opcionesPersonalizadas?: OpcionPersonalizada[];
}
