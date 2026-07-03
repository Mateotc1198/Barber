"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
      </svg>
    ),
    titulo: "Calidad Garantizada",
    descripcion: "Usamos productos premium y técnicas actualizadas. Si no quedas satisfecho, lo solucionamos sin costo.",
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    titulo: "Puntualidad Total",
    descripcion: "Respetamos tu tiempo. Reserva tu cita y llegaremos listos para ti sin hacerte esperar.",
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    titulo: "Barberos Expertos",
    descripcion: "Nuestro equipo tiene años de formación y práctica. Cada barbero domina técnicas clásicas y modernas.",
  },
  {
    icono: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09zM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456zM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423z" />
      </svg>
    ),
    titulo: "Experiencia Premium",
    descripcion: "Cada visita es más que un corte: es una experiencia. Ambiente cuidado, música seleccionada y atención personalizada.",
  },
];

export function SeccionCaracteristicas() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 px-[var(--page-padding-x)]"
    >
      <div className="max-w-[var(--page-max-width)] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 mb-3">
            ¿Por qué elegirnos?
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-4">
            Más que un corte.
            <br />
            <span className="gradient-text">Una experiencia.</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
            Cada detalle está pensado para que salgas sintiéndote en tu mejor versión.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.titulo}
              className={`group p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 hover:bg-amber-50 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 hover:border-amber-200 dark:hover:border-amber-900 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms`, transitionProperty: "opacity, transform, background, border" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-amber-600 dark:text-amber-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {f.icono}
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">{f.titulo}</h3>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
