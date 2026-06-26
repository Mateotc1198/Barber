export interface Categoria {
  id: string;
  nombre: string;
  imagenBanner: string;
  orden: number;
  updatedAt: Date;
}

export type CategoriaUpdate = Pick<Categoria, "imagenBanner" | "orden">;
