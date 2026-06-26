"use client";

import { useEffect, useState } from "react";

export function BotonTema() {
  const [oscuro, setOscuro] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    setOscuro(document.documentElement.classList.contains("dark"));
  }, []);

  function alternar() {
    const nuevoEstado = !oscuro;
    setOscuro(nuevoEstado);
    document.documentElement.classList.toggle("dark", nuevoEstado);
    try {
      localStorage.setItem("tema", nuevoEstado ? "oscuro" : "claro");
    } catch {
      /* ignorar */
    }
  }

  if (!montado) return null;

  return (
    <button
      onClick={alternar}
      aria-label={oscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={oscuro ? "Modo claro" : "Modo oscuro"}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
    >
      <span
        className="block transition-all duration-500"
        style={{ transform: oscuro ? "rotate(0deg)" : "rotate(180deg)" }}
      >
        {oscuro ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
    </button>
  );
}
