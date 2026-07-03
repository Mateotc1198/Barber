"use client";

import { useEffect, useState } from "react";
import { IconoWhatsApp } from "@/components/ui/IconoWhatsApp";
import { NUMERO_WHATSAPP, NOMBRE_BARBERIA } from "@/constants/barberia";

export function BotonWhatsApp() {
  const [elevar, setElevar] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      setElevar(scrollable > 0 && window.scrollY >= scrollable - 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const mensaje = encodeURIComponent(
    `Hola! Me gustaría reservar una cita en ${NOMBRE_BARBERIA}. ¿Cuál es la disponibilidad?`
  );

  return (
    <a
      href={`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed right-6 z-50 p-4 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-[0_8px_24px_rgba(34,197,94,0.45)] hover:shadow-[0_10px_28px_rgba(34,197,94,0.6)] ring-1 ring-white/15 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
        elevar ? "bottom-24" : "bottom-6"
      }`}
    >
      <IconoWhatsApp className="w-7 h-7" />
    </a>
  );
}
