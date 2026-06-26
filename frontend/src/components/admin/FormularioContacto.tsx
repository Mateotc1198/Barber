"use client";

import { useState } from "react";
import Image from "next/image";
import { ContactInfo, ContactInfoUpdate } from "@/types/contacto";
import { contactoApi } from "@/infrastructure/api/contactoApi";
import { imagenesApi } from "@/infrastructure/api/imagenesApi";
import { REDES } from "@/components/contact/iconosRedes";

interface Props {
  inicial: ContactInfo | null;
  onActualizado: (info: ContactInfo) => void;
}

export function FormularioContacto({ inicial, onActualizado }: Props) {
  const [form, setForm] = useState<ContactInfoUpdate>({
    nombre: inicial?.nombre ?? "",
    fotoUrl: inicial?.fotoUrl ?? "",
    instagram: inicial?.instagram ?? null,
    facebook: inicial?.facebook ?? null,
    whatsapp: inicial?.whatsapp ?? null,
    tiktok: inicial?.tiktok ?? null,
    twitter: inicial?.twitter ?? null,
    gmail: inicial?.gmail ?? null,
    youtube: inicial?.youtube ?? null,
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  function cambiar(campo: keyof ContactInfoUpdate, valor: string | null) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function subirFoto(archivo: File) {
    setSubiendo(true);
    try {
      const url = await imagenesApi.subir(archivo);
      cambiar("fotoUrl", url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir foto");
    } finally {
      setSubiendo(false);
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      const resultado = await contactoApi.actualizar(form);
      onActualizado(resultado);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={(e) => void guardar(e)} className="space-y-5 max-w-lg">
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">{error}</div>
      )}

      {/* Foto */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
          {form.fotoUrl ? (
            <Image src={form.fotoUrl} alt="Foto" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">✂</div>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="foto-perfil"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void subirFoto(f); }}
          />
          <label htmlFor="foto-perfil" className="inline-block px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors cursor-pointer">
            {subiendo ? "Subiendo..." : "Cambiar foto"}
          </label>
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 mb-1 block">Nombre de la barbería</label>
        <input value={form.nombre} onChange={(e) => cambiar("nombre", e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>

      {/* Redes */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Redes sociales</p>
        {REDES.map((red) => (
          <div key={red.key} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0" style={{ background: "var(--accent)" }}>{red.icon}</span>
            <input
              type="text"
              placeholder={`${red.label} (usuario o URL completa)`}
              value={(form[red.key as keyof ContactInfoUpdate] as string) ?? ""}
              onChange={(e) => cambiar(red.key as keyof ContactInfoUpdate, e.target.value || null)}
              className="flex-1 px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        ))}
      </div>

      <button type="submit" disabled={guardando} className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-400 text-white font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed">
        {guardando ? "Guardando..." : "Guardar contacto"}
      </button>
    </form>
  );
}
