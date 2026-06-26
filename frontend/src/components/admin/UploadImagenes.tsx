"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { imagenesApi } from "@/infrastructure/api/imagenesApi";

interface Props {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function UploadImagenes({ urls, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  async function subirArchivo(archivo: File) {
    setSubiendo(true);
    setError(null);
    try {
      const url = await imagenesApi.subir(archivo);
      onChange([...urls, url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setSubiendo(false);
    }
  }

  function agregarUrl() {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...urls, url]);
    setUrlInput("");
  }

  function eliminar(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {/* Miniaturas */}
      {urls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {urls.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
              <Image src={url} alt={`Imagen ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => eliminar(i)}
                className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Subir archivo */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void subirArchivo(file);
          }}
        />
        <button
          type="button"
          disabled={subiendo}
          onClick={() => inputRef.current?.click()}
          className="w-full py-3 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 dark:text-zinc-400 hover:border-amber-500 hover:text-amber-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {subiendo ? "Subiendo..." : "+ Subir imagen (JPEG, PNG, WebP, AVIF · máx 5 MB)"}
        </button>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* URL manual */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="O pega una URL de imagen..."
          className="flex-1 px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregarUrl(); } }}
        />
        <button
          type="button"
          onClick={agregarUrl}
          className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
