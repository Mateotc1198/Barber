"use client";

import { useState } from "react";
import { Servicio } from "@/types/servicio";

interface Props {
  servicio: Servicio;
}

export function OpcionesServicio({ servicio }: Props) {
  const [seleccion, setSeleccion] = useState<Record<string, string>>({});

  if (!servicio.opcionesPersonalizadas?.length) return null;

  return (
    <div className="space-y-5">
      {servicio.opcionesPersonalizadas.map((opcion) => (
        <div key={opcion.nombre}>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">{opcion.nombre}</p>
          <div className="flex flex-wrap gap-2">
            {opcion.valores.map((valor) => (
              <button
                key={valor}
                onClick={() => setSeleccion((prev) => ({ ...prev, [opcion.nombre]: valor }))}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
                  seleccion[opcion.nombre] === valor
                    ? "bg-amber-600 border-amber-600 text-white"
                    : "border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:border-amber-500"
                }`}
              >
                {valor}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
