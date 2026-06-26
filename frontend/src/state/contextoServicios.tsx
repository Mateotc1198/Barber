"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Servicio } from "@/types/servicio";
import { Categoria } from "@/types/categoria";
import { serviciosApi } from "@/infrastructure/api/serviciosApi";
import { categoriasApi } from "@/infrastructure/api/categoriasApi";

interface EstadoServicios {
  servicios: Servicio[];
  categorias: Categoria[];
  cargando: boolean;
  error: string | null;
  recargar: () => Promise<void>;
}

const ContextoServicios = createContext<EstadoServicios | null>(null);

export function ProveedorServicios({ children }: { children: ReactNode }) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [svcs, cats] = await Promise.all([
        serviciosApi.listar(),
        categoriasApi.listar(),
      ]);
      setServicios(svcs);
      setCategorias(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void recargar();
  }, [recargar]);

  return (
    <ContextoServicios.Provider value={{ servicios, categorias, cargando, error, recargar }}>
      {children}
    </ContextoServicios.Provider>
  );
}

export function useServicios(): EstadoServicios {
  const ctx = useContext(ContextoServicios);
  if (!ctx) {
    throw new Error("useServicios debe usarse dentro de <ProveedorServicios>");
  }
  return ctx;
}
