"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/infrastructure/api/authApi";
import { NOMBRE_BARBERIA } from "@/constants/barberia";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function ingresar(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await authApi.login(username, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <p className="text-3xl mb-2">✂</p>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{NOMBRE_BARBERIA}</h1>
          <p className="text-sm text-zinc-500 mt-1">Administración</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={(e) => void ingresar(e)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-400 text-white font-semibold text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
