"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/infrastructure/api/authApi";
import { serviciosApi } from "@/infrastructure/api/serviciosApi";
import { contactoApi } from "@/infrastructure/api/contactoApi";
import { categoriasApi } from "@/infrastructure/api/categoriasApi";
import { barberosApi } from "@/infrastructure/api/barberosApi";
import { Servicio } from "@/types/servicio";
import { ContactInfo } from "@/types/contacto";
import { Categoria } from "@/types/categoria";
import { Barbero } from "@/types/barbero";
import { ListaServiciosAdmin } from "@/components/admin/ListaServiciosAdmin";
import { FormularioContacto } from "@/components/admin/FormularioContacto";
import { ListaCategoriasAdmin } from "@/components/admin/ListaCategoriasAdmin";
import { AgendaAdmin } from "@/components/admin/AgendaAdmin";
import { BarberosAdmin } from "@/components/admin/BarberosAdmin";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { NOMBRE_BARBERIA } from "@/constants/barberia";

type Tab = "agenda" | "barberos" | "servicios" | "contacto" | "categorias";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("agenda");
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contacto, setContacto] = useState<ContactInfo | null>(null);
  const [barberos, setBarberos] = useState<Barbero[]>([]);

  useEffect(() => {
    void authApi
      .yo()
      .then(() => {
        setAutenticado(true);
        void cargarTodo();
      })
      .catch(() => router.replace("/admin/login"))
      .finally(() => setCargando(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function cargarTodo() {
    const [svcs, cats, cont, barbs] = await Promise.all([
      serviciosApi.listar(),
      categoriasApi.listar(),
      contactoApi.obtener(),
      barberosApi.listar(),
    ]);
    setServicios(svcs);
    setCategorias(cats);
    setContacto(cont);
    setBarberos(barbs);
  }

  async function cerrarSesion() {
    await authApi.logout();
    router.replace("/admin/login");
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-amber-600/30 border-t-amber-600 animate-spin" />
      </div>
    );
  }

  if (!autenticado) return null;

  const categoriaNames = [...new Set(servicios.map((s) => s.categoria))];

  const TABS: { key: Tab; label: string }[] = [
    { key: "agenda", label: "Agenda" },
    { key: "barberos", label: "Barberos" },
    { key: "servicios", label: "Servicios" },
    { key: "contacto", label: "Contacto" },
    { key: "categorias", label: "Categorías" },
  ];

  return (
    <ToastProvider>
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-28 sm:pb-16">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-[var(--page-padding-x)] py-4">
        <div className="max-w-[var(--page-max-width)] mx-auto flex justify-between items-center">
          <Link href="/" className="group">
            <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{NOMBRE_BARBERIA}</p>
            <p className="text-xs text-zinc-500">Panel de administración</p>
          </Link>
          <button
            onClick={() => void cerrarSesion()}
            className="text-sm text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-[var(--page-max-width)] mx-auto px-[var(--page-padding-x)] pt-6 sm:pt-8">
        <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                tab === t.key
                  ? "bg-amber-600 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "agenda" && <AgendaAdmin />}
        {tab === "barberos" && (
          <BarberosAdmin barberos={barberos} onActualizar={cargarTodo} />
        )}

        {tab === "servicios" && (
          <ListaServiciosAdmin
            servicios={servicios}
            categorias={categoriaNames}
            onActualizar={cargarTodo}
          />
        )}

        {tab === "contacto" && (
          <FormularioContacto
            inicial={contacto}
            onActualizado={(info) => setContacto(info)}
          />
        )}

        {tab === "categorias" && (
          <ListaCategoriasAdmin
            categorias={categorias}
            onActualizar={cargarTodo}
          />
        )}
      </div>
    </main>
    </ToastProvider>
  );
}
