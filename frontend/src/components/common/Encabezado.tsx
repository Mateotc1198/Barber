"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useServicios } from "@/state/contextoServicios";
import { NOMBRE_BARBERIA } from "@/constants/barberia";

export function Encabezado() {
  const { categorias } = useServicios();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [catalogoAbierto, setCatalogoAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
      style={{ height: "var(--header-height)" }}
    >
      <div
        className="flex items-center justify-between h-full"
        style={{ paddingInline: "var(--page-padding-x)" }}
      >
        <Link
          href="/"
          className="font-bold text-lg tracking-widest text-zinc-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          {NOMBRE_BARBERIA}
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Inicio
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCatalogoAbierto(true)}
            onMouseLeave={() => setCatalogoAbierto(false)}
          >
            <button className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
              Servicios
              <svg viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 transition-transform ${catalogoAbierto ? "rotate-180" : ""}`}>
                <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {catalogoAbierto && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-2">
                <Link href="/servicios" className="block px-4 py-2 text-sm rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors">
                  Todos los servicios
                </Link>
                {categorias.map((c) => (
                  <Link
                    key={c.id}
                    href={`/servicios?categoria=${encodeURIComponent(c.nombre)}`}
                    className="block px-4 py-2 text-sm rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors"
                  >
                    {c.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/contacto" className="text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Contacto
          </Link>
        </nav>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Menú"
        >
          {menuAbierto ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuAbierto && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 shadow-xl py-4 px-6 flex flex-col gap-3">
          <Link href="/" onClick={() => setMenuAbierto(false)} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Inicio</Link>
          <Link href="/servicios" onClick={() => setMenuAbierto(false)} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Todos los servicios</Link>
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/servicios?categoria=${encodeURIComponent(c.nombre)}`}
              onClick={() => setMenuAbierto(false)}
              className="text-sm font-medium pl-4 text-zinc-500 dark:text-zinc-400"
            >
              {c.nombre}
            </Link>
          ))}
          <Link href="/contacto" onClick={() => setMenuAbierto(false)} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Contacto</Link>
        </div>
      )}
    </header>
  );
}
