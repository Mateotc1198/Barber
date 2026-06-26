"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Categoria } from "@/types/categoria";

interface Props {
  categorias: Categoria[];
}

export function FiltroCategorias({ categorias }: Props) {
  const params = useSearchParams();
  const categoriaActual = params.get("categoria") ?? "";

  const chips = [
    { label: "Todos", href: "/servicios" },
    ...categorias.map((c) => ({
      label: c.nombre,
      href: `/servicios?categoria=${encodeURIComponent(c.nombre)}`,
    })),
  ];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {chips.map((chip) => {
        const activo = chip.label === "Todos" ? !categoriaActual : chip.label === categoriaActual;
        return (
          <Link
            key={chip.label}
            href={chip.href}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activo
                ? "bg-amber-600 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
