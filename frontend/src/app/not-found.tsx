import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-7xl font-black text-amber-600 mb-4">404</p>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Página no encontrada</h2>
        <p className="text-sm text-zinc-500 mb-6">La página que buscas no existe o fue movida.</p>
        <Link href="/" className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
