"use client";

import { useRef, useEffect } from "react";
import { Servicio } from "@/types/servicio";
import { TarjetaServicio } from "./TarjetaServicio";

interface Props {
  servicios: Servicio[];
}

const CARD_GAP = 20;
const CARD_WIDTH = 280;

export function CarruselServicios({ servicios }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || servicios.length < 2) return;

    const step = () => {
      if (!pausedRef.current) {
        posRef.current += 0.5;
        const halfWidth = (CARD_WIDTH + CARD_GAP) * servicios.length;
        if (posRef.current >= halfWidth) posRef.current -= halfWidth;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [servicios.length]);

  const doubled = [...servicios, ...servicios];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ gap: CARD_GAP, width: "max-content" }}
      >
        {doubled.map((s, i) => (
          <div key={`${s.id}-${i}`} style={{ width: CARD_WIDTH, flexShrink: 0 }}>
            <TarjetaServicio servicio={s} />
          </div>
        ))}
      </div>
    </div>
  );
}
