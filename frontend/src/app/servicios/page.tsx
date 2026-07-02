"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Encabezado } from "@/components/common/Encabezado";
import { PieDePagina } from "@/components/common/PieDePagina";
import { BotonTema } from "@/components/ui/BotonTema";
import { FiltroCategorias } from "@/components/catalog/FiltroCategorias";
import { GrillaServicios } from "@/components/services/GrillaServicios";
import { EsqueletoGrilla } from "@/components/catalog/EsqueletoGrilla";
import { useServicios } from "@/state/contextoServicios";

function Catalogo() {
  const params = useSearchParams();
  const categoriaSeleccionada = params.get("categoria") ?? "";
  const { servicios, categorias, cargando } = useServicios();
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"relevancia" | "precio-asc" | "precio-desc">("relevancia");

  const filtrados = useMemo(() => {
    let lista = categoriaSeleccionada
      ? servicios.filter((s) => s.categoria === categoriaSeleccionada)
      : servicios;

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.descripcion.toLowerCase().includes(q) ||
          s.categoria.toLowerCase().includes(q)
      );
    }

    if (orden === "precio-asc") lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") lista = [...lista].sort((a, b) => b.precio - a.precio);

    return lista;
  }, [servicios, categoriaSeleccionada, busqueda, orden]);

  return (
    <>
      <Encabezado />
      <BotonTema />
      <main className="min-h-screen pt-[var(--header-height)] pb-16 px-[var(--page-padding-x)]">
        <div className="max-w-[var(--page-max-width)] mx-auto">
          <div className="py-10">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Nuestros Servicios</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              {filtrados.length} servicio{filtrados.length !== 1 ? "s" : ""} disponibles
            </p>
          </div>

          {/* Toolbar */}
          <div className="sticky top-[var(--header-height)] z-30 py-3 bg-[var(--background)] border-b border-zinc-100 dark:border-zinc-800 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <FiltroCategorias categorias={categorias} />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <input
                  type="search"
                  placeholder="Buscar..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="px-3 py-2 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500 w-36"
                />
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as typeof orden)}
                  className="px-3 py-2 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio: menor</option>
                  <option value="precio-desc">Precio: mayor</option>
                </select>
              </div>
            </div>
          </div>

          {cargando ? <EsqueletoGrilla /> : <GrillaServicios servicios={filtrados} />}
        </div>
      </main>
      <PieDePagina />
    </>
  );
}

export default function ServiciosPage() {
  return (
    <Suspense>
      <Catalogo />
    </Suspense>
  );
}
