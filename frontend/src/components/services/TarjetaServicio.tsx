import Image from "next/image";
import Link from "next/link";
import { Servicio } from "@/types/servicio";

interface Props {
  servicio: Servicio;
  popular?: boolean;
}

export function TarjetaServicio({ servicio, popular = false }: Props) {
  return (
    <Link
      href={`/servicio/${servicio.id}`}
      className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)] dark:shadow-[var(--shadow-card-dark)] hover:-translate-y-2 hover:shadow-2xl transition-all duration-400"
    >
      {/* Imagen */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {servicio.imagenes[0] ? (
          <Image
            src={servicio.imagenes[0]}
            alt={servicio.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-600">
            Sin imagen
          </div>
        )}

        {!servicio.disponible && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-white font-semibold text-sm bg-black/70 px-4 py-1.5 rounded-full tracking-wide">
              Sin disponibilidad
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {popular && (
            <span className="text-[10px] font-black tracking-widest uppercase bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-lg">
              Popular
            </span>
          )}
          <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm bg-black/40 text-white/90">
            {servicio.categoria}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
          {servicio.nombre}
        </h3>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {servicio.descripcion}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            {servicio.duracionMinutos} min
          </span>
        </div>

        <div className="pt-1">
          <span className="text-xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            ${servicio.precio.toLocaleString("es-CO")}
          </span>
          <span className="text-[10px] text-zinc-400 ml-1">COP</span>
        </div>
      </div>
    </Link>
  );
}
