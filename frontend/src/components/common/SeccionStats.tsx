"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { valor: "5+", label: "Años de experiencia" },
  { valor: "1K+", label: "Clientes satisfechos" },
  { valor: "4.9", label: "Calificación promedio" },
  { valor: "22", label: "Servicios disponibles" },
];

export function SeccionStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-zinc-950 dark:bg-black py-14 px-[var(--page-padding-x)]"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center transition-[opacity,transform] duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <p className="text-4xl font-black text-amber-400 mb-1 tracking-tight">{stat.valor}</p>
            <p className="text-xs text-zinc-400 tracking-wide uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
