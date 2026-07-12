"use client";

import { useState } from "react";

interface Props {
  valor: number;
  onChange?: (v: number) => void;
  tamano?: "sm" | "md" | "lg";
}

export function EstrellasRating({ valor, onChange, tamano = "sm" }: Props) {
  const [hover, setHover] = useState(0);
  const interactivo = !!onChange;
  const dim = tamano === "lg" ? "w-7 h-7" : tamano === "md" ? "w-5 h-5" : "w-3.5 h-3.5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const activo = (hover || valor) >= n;
        return (
          <button
            key={n}
            type="button"
            disabled={!interactivo}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => interactivo && setHover(n)}
            onMouseLeave={() => interactivo && setHover(0)}
            className={interactivo ? "cursor-pointer" : "cursor-default"}
            aria-label={`${n} estrellas`}
          >
            <svg
              viewBox="0 0 20 20"
              fill={activo ? "#f59e0b" : "none"}
              stroke="#f59e0b"
              strokeWidth={activo ? 0 : 1.5}
              className={dim}
            >
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.62.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
