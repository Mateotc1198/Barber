import { Servicio } from "@/types/servicio";
import { TarjetaServicio } from "./TarjetaServicio";

interface Props {
  servicios: Servicio[];
}

export function GrillaServicios({ servicios }: Props) {
  if (servicios.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400 dark:text-zinc-500">
        <p className="text-4xl mb-4">✂</p>
        <p className="text-lg font-medium">Sin servicios disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {servicios.map((s) => (
        <TarjetaServicio key={s.id} servicio={s} />
      ))}
    </div>
  );
}
