import Image from "next/image";
import { ContactInfo } from "@/types/contacto";
import { REDES } from "./iconosRedes";

interface Props {
  info: ContactInfo;
}

export function TarjetaContacto({ info }: Props) {
  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 text-center">
      <div className="relative w-28 h-28 mx-auto mb-5">
        {info.fotoUrl ? (
          <Image
            src={info.fotoUrl}
            alt={info.nombre}
            fill
            className="rounded-full object-cover ring-4 ring-amber-500/30"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-3xl font-bold text-amber-600">
            {info.nombre.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        {info.nombre}
      </h2>

      <div className="grid grid-cols-4 gap-3">
        {REDES.map((red) => {
          const valor = info[red.key];
          if (!valor || typeof valor !== "string") return null;
          const href = red.baseUrl + valor;
          return (
            <a
              key={red.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={red.label}
              className={`${red.color} text-white p-3 rounded-2xl flex items-center justify-center hover:opacity-90 hover:scale-105 transition-all`}
            >
              {red.icon}
            </a>
          );
        })}
      </div>
    </div>
  );
}
