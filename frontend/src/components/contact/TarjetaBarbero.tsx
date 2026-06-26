import { Barbero } from "@/types/barbero";

interface Props {
  barbero: Barbero;
}

export function TarjetaBarbero({ barbero }: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 text-center shadow-sm border border-zinc-100 dark:border-zinc-800">
      <div className="relative w-20 h-20 mx-auto mb-3">
        {barbero.fotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={barbero.fotoUrl}
            alt={barbero.nombre}
            className="w-full h-full rounded-full object-cover ring-4 ring-amber-500/20"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-3xl">
            ✂
          </div>
        )}
      </div>
      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{barbero.nombre}</p>
      {barbero.descripcion && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-relaxed">{barbero.descripcion}</p>
      )}
    </div>
  );
}
