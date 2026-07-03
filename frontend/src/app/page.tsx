import Link from "next/link";
import { Encabezado } from "@/components/common/Encabezado";
import { PieDePagina } from "@/components/common/PieDePagina";
import { Hero } from "@/components/common/Hero";
import { BotonTema } from "@/components/ui/BotonTema";
import { BotonWhatsApp } from "@/components/common/BotonWhatsApp";
import { SeccionCaracteristicas } from "@/components/common/SeccionCaracteristicas";
import { SeccionCategorias } from "@/components/common/SeccionCategorias";
import { SeccionHorarios } from "@/components/common/SeccionHorarios";
import { SeccionCTA } from "@/components/common/SeccionCTA";
import { CarruselServicios } from "@/components/services/CarruselServicios";
import { GrillaServicios } from "@/components/services/GrillaServicios";
import { serviciosApi } from "@/infrastructure/api/serviciosApi";
import { categoriasApi } from "@/infrastructure/api/categoriasApi";

const MAX_CARRUSEL = 3;

export default async function HomePage() {
  const [servicios, categorias] = await Promise.all([
    serviciosApi.listar().catch(() => []),
    categoriasApi.listar().catch(() => []),
  ]);

  const categoriasPorCarrusel = categorias.slice(0, MAX_CARRUSEL);
  const restoCategorias = categorias.slice(MAX_CARRUSEL);

  return (
    <>
      <Encabezado />
      <BotonTema />
      <BotonWhatsApp />

      <main>
        {/* 1. Hero */}
        <Hero />

        {/* 2. Por qué elegirnos (confianza) */}
        <SeccionCaracteristicas />

        {/* 3. Categorías visuales */}
        <SeccionCategorias categorias={categorias} />

        {/* 5. Servicios por categoría */}
        <div className="px-[var(--page-padding-x)] py-16 max-w-[var(--page-max-width)] mx-auto space-y-16">
          {categoriasPorCarrusel.map((cat) => {
            const items = servicios.filter((s) => s.categoria === cat.nombre);
            if (items.length === 0) return null;
            return (
              <section key={cat.id}>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 mb-1">
                      {cat.nombre}
                    </p>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {CAT_SUBTITULOS[cat.nombre] ?? cat.nombre}
                    </h2>
                  </div>
                  <Link
                    href={`/servicios?categoria=${encodeURIComponent(cat.nombre)}`}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    Ver todos
                  </Link>
                </div>
                <CarruselServicios servicios={items} />
              </section>
            );
          })}

          {restoCategorias.map((cat) => {
            const items = servicios.filter((s) => s.categoria === cat.nombre);
            if (items.length === 0) return null;
            return (
              <section key={cat.id}>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-amber-600 dark:text-amber-400 mb-1">
                      {cat.nombre}
                    </p>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                      {CAT_SUBTITULOS[cat.nombre] ?? cat.nombre}
                    </h2>
                  </div>
                  <Link
                    href={`/servicios?categoria=${encodeURIComponent(cat.nombre)}`}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    Ver todos
                  </Link>
                </div>
                <GrillaServicios servicios={items} />
              </section>
            );
          })}
        </div>

        {/* 6. Horarios */}
        <SeccionHorarios />

        {/* 7. Cierre de conversión */}
        <SeccionCTA />
      </main>

      <PieDePagina />
    </>
  );
}

const CAT_SUBTITULOS: Record<string, string> = {
  Cortes: "El corte que te define",
  Barba: "Barba impecable, look completo",
  "Color & Estilos": "Expresa tu estilo",
};
