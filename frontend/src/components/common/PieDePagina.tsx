import Link from "next/link";
import { NOMBRE_BARBERIA, ESLOGAN_BARBERIA, NUMERO_WHATSAPP } from "@/constants/barberia";

export function PieDePagina() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      {/* Main footer */}
      <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-white font-black text-xl tracking-widest mb-2">{NOMBRE_BARBERIA}</p>
            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">{ESLOGAN_BARBERIA}</p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${NUMERO_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-green-600 flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.656 1.448 5.158L2 22l4.985-1.306A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-orange-400 flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-black border border-transparent hover:border-zinc-600 flex items-center justify-center transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34l-.01-8.83a8.2 8.2 0 0 0 4.78 1.52V4.54a4.84 4.84 0 0 1-1-.15z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <p className="text-white font-bold mb-4 text-xs uppercase tracking-[0.15em]">Servicios</p>
            <ul className="space-y-2.5 text-sm">
              {["Cortes", "Barba", "Color & Estilos"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/servicios?categoria=${cat}`}
                    className="hover:text-amber-400 transition-colors hover:pl-1 duration-200 block"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <p className="text-white font-bold mb-4 text-xs uppercase tracking-[0.15em]">Empresa</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-amber-400 transition-colors hover:pl-1 duration-200 block">Inicio</Link></li>
              <li><Link href="/servicios" className="hover:text-amber-400 transition-colors hover:pl-1 duration-200 block">Catálogo</Link></li>
              <li><Link href="/contacto" className="hover:text-amber-400 transition-colors hover:pl-1 duration-200 block">Contacto</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400 transition-colors hover:pl-1 duration-200 block">Administración</Link></li>
            </ul>
          </div>

          {/* Horario */}
          <div>
            <p className="text-white font-bold mb-4 text-xs uppercase tracking-[0.15em]">Horarios</p>
            <ul className="space-y-1.5 text-xs">
              {[
                ["Lun – Vie", "9:00 am – 7:00 pm"],
                ["Viernes", "9:00 am – 8:00 pm"],
                ["Sábado", "8:00 am – 8:00 pm"],
                ["Domingo", "Cerrado"],
              ].map(([dia, hora]) => (
                <li key={dia} className="flex justify-between gap-4">
                  <span>{dia}</span>
                  <span className={hora === "Cerrado" ? "text-red-400" : "text-zinc-300"}>{hora}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-600">
            &copy; {year} {NOMBRE_BARBERIA}. Todos los derechos reservados.
          </p>
          <p className="text-xs text-zinc-700">
            Hecho con dedicacion para los que cuidan su imagen
          </p>
        </div>
      </div>
    </footer>
  );
}
