"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  imagenes: string[];
  nombre: string;
}

export function CarruselImagenes({ imagenes, nombre }: Props) {
  const [activa, setActiva] = useState(0);

  const prev = () => setActiva((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  const next = () => setActiva((i) => (i === imagenes.length - 1 ? 0 : i + 1));

  if (imagenes.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-6xl text-zinc-300">
        ✂
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={imagenes[activa]}
          alt={`${nombre} — imagen ${activa + 1}`}
          fill
          className="object-cover"
          priority={activa === 0}
        />
        {imagenes.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {imagenes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {imagenes.map((url, i) => (
            <button
              key={i}
              onClick={() => setActiva(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                i === activa ? "border-amber-500" : "border-transparent"
              }`}
            >
              <Image src={url} alt={`Miniatura ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
