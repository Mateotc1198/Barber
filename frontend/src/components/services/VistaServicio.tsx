"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Servicio } from "@/types/servicio";
import { CarruselImagenes } from "./CarruselImagenes";
import { OpcionesServicio } from "./OpcionesServicio";
import { CarruselServicios } from "./CarruselServicios";

interface Props {
  servicio: Servicio;
  relacionados: Servicio[];
}

export function VistaServicio({ servicio, relacionados }: Props) {
  const router = useRouter();
  return (
    <main className="min-h-screen pt-[var(--header-height)] pb-16 px-[var(--page-padding-x)]">
      <div className="max-w-[var(--page-max-width)] mx-auto mt-8">
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-amber-600 transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Volver a servicios
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <CarruselImagenes imagenes={servicio.imagenes} nombre={servicio.nombre} />

          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-3">
              {servicio.categoria}
            </span>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              {servicio.nombre}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                ${servicio.precio.toLocaleString("es-CO")}
              </span>
              <span className="text-sm text-zinc-500">{servicio.duracionMinutos} min</span>
              <span className={`text-sm font-medium ${servicio.disponible ? "text-green-600" : "text-red-500"}`}>
                {servicio.disponible ? "Disponible" : "Sin disponibilidad"}
              </span>
            </div>

            {servicio.descripcion && (
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                {servicio.descripcion}
              </p>
            )}

            <OpcionesServicio servicio={servicio} />

            <button
              onClick={() => router.push("/reservar")}
              disabled={!servicio.disponible}
              className="mt-6 w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-black text-base transition-colors disabled:cursor-not-allowed cursor-pointer"
            >
              Reservar cita
            </button>
          </div>
        </div>

        {relacionados.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
              También te puede interesar
            </h2>
            <CarruselServicios servicios={relacionados} />
          </section>
        )}
      </div>
    </main>
  );
}
