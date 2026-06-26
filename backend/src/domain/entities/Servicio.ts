export interface OpcionPersonalizada {
  name: string;
  values: string[];
}

export interface Servicio {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  cupos: number;
  duracionMinutos: number;
  customOptions?: OpcionPersonalizada[];
  createdAt: Date;
  updatedAt: Date;
}

export type ServicioData = Omit<Servicio, "id" | "createdAt" | "updatedAt">;
