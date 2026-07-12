import Link from "next/link";
import { NOMBRE_BARBERIA } from "@/constants/barberia";

export function EncabezadoReservar() {
  return (
    <header className="h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-zinc-100 dark:border-zinc-800">
      <Link
        href="/"
        aria-label="Cerrar y volver al inicio"
        className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>
      <span className="text-xs font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">
        {NOMBRE_BARBERIA}
      </span>
      <span className="w-8 h-8" aria-hidden />
    </header>
  );
}
