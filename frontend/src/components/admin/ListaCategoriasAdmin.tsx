"use client";

import { useState } from "react";
import Image from "next/image";
import { Categoria } from "@/types/categoria";
import { categoriasApi } from "@/infrastructure/api/categoriasApi";
import { imagenesApi } from "@/infrastructure/api/imagenesApi";
import { useToast } from "@/components/ui/ToastProvider";

interface Props {
  categorias: Categoria[];
  onActualizar: () => Promise<void>;
}

export function ListaCategoriasAdmin({ categorias, onActualizar }: Props) {
  const { mostrar } = useToast();
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function subirBanner(nombre: string, archivo: File) {
    setSubiendo(nombre);
    setError(null);
    try {
      const url = await imagenesApi.subir(archivo);
      await categoriasApi.actualizar(nombre, { imagenBanner: url, orden: 0 });
      await onActualizar();
      mostrar("Banner actualizado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir banner");
    } finally {
      setSubiendo(null);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
              {cat.imagenBanner ? (
                <Image src={cat.imagenBanner} alt={cat.nombre} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">Sin imagen</div>
              )}
            </div>
            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-2">{cat.nombre}</p>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={subiendo === cat.nombre}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void subirBanner(cat.nombre, f);
                }}
              />
              <span className="inline-block px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors cursor-pointer">
                {subiendo === cat.nombre ? "Subiendo..." : "Cambiar banner"}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
