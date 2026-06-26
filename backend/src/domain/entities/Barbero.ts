export interface Barbero {
  id: string;
  nombre: string;
  fotoUrl: string;
  descripcion: string;
  activo: boolean;
  orden: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarberoData {
  nombre: string;
  fotoUrl?: string;
  descripcion?: string;
  activo?: boolean;
  orden?: number;
}
