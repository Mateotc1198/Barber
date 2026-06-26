export interface Categoria {
  id: string;
  nombre: string;
  imagenBanner: string;
  orden: number;
  updatedAt: string;
}

export type CategoriaUpdate = Pick<Categoria, "imagenBanner" | "orden">;
