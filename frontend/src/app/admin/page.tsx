"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/infrastructure/api/authApi";
import { serviciosApi } from "@/infrastructure/api/serviciosApi";
import { contactoApi } from "@/infrastructure/api/contactoApi";
import { categoriasApi } from "@/infrastructure/api/categoriasApi";
import { Servicio } from "@/types/servicio";
import { ContactInfo } from "@/types/contacto";
import { Categoria } from "@/types/categoria";
import { ListaServiciosAdmin } from "@/components/admin/ListaServiciosAdmin";
import { FormularioContacto } from "@/components/admin/FormularioContacto";
import { ListaCategoriasAdmin } from "@/components/admin/ListaCategoriasAdmin";
import { AgendaAdmin } from "@/components/admin/AgendaAdmin";
import { BarberosAdmin } from "@/components/admin/BarberosAdmin";
import { NOMBRE_BARBERIA } from "@/constants/barberia";
import { BotonTema } from "@/components/ui/BotonTema";

type Tab = "agenda" | "barberos" | "servicios" | "contacto" | "categorias";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("agenda");
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contacto, setContacto] = useState<ContactInfo | null>(null);

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
    const [svcs, cats, cont] = await Promise.all([
      serviciosApi.listar(),
      categoriasApi.listar(),
      contactoApi.obtener(),
    ]);
    setServicios(svcs);
    setCategorias(cats);
    setContacto(cont);
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
    { key: "agenda", label: "📅 Agenda" },
    { key: "barberos", label: "Barberos" },
    { key: "servicios", label: "Servicios" },
    { key: "contacto", label: "Contacto" },
    { key: "categorias", label: "Categorías" },
  ];

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16">
      <BotonTema />

      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 px-[var(--page-padding-x)] py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <p className="font-bold text-lg text-zinc-900 dark:text-zinc-100">✂ {NOMBRE_BARBERIA}</p>
            <p className="text-xs text-zinc-500">Panel de administración</p>
          </div>
          <button
            onClick={() => void cerrarSesion()}
            className="text-sm text-zinc-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-[var(--page-padding-x)] pt-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
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
        {tab === "barberos" && <BarberosAdmin />}

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
  );
}
