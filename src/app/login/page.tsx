"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Correo o contraseña incorrectos.");
        return;
      }

      // Cookie ya viene seteada → redirigimos
      router.replace("/analisis-bia");
    } catch (err) {
      console.error("Error al hacer login:", err);
      setError("Ocurrió un error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
      {/* Capa decorativa */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.22),_transparent_70%),_radial-gradient(circle_at_right,_rgba(59,130,246,0.22),_transparent_70%)]" />

      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Lado informativo */}
          <div className="hidden md:flex flex-col gap-6 text-slate-100">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 rounded-2xl bg-slate-900/70 border border-slate-700/70 flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo-institucion.png"
                  alt="Logo institucional"
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  Sistema- PCSAL
                </p>
                <h1 className="text-2xl font-semibold leading-tight">
                  Gestión de Procesos Críticos
                </h1>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Plataforma para administrar estrategias de prevención, contingencia,
              recuperación y divulgación asociadas a procesos críticos por área.
            </p>

            <div className="flex flex-col gap-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-xl border border-slate-500/70 flex items-center justify-center text-xs">
                  1
                </span>
                Consulta estrategias por departamento y proceso crítico.
              </div>
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-xl border border-slate-500/70 flex items-center justify-center text-xs">
                  2
                </span>
                Documenta simulacros, pruebas y resultados de continuidad.
              </div>
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-xl border border-slate-500/70 flex items-center justify-center text-xs">
                  3
                </span>
                Consulta el análisis BIA institucional.
              </div>
            </div>
          </div>

          {/* Tarjeta de login */}
          <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-700/70 shadow-2xl shadow-slate-900/80 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-50">
                  Iniciar sesión
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Acceso institucional
                </p>
              </div>
              <div className="inline-flex h-10 px-3 items-center justify-center rounded-xl border border-slate-600/80 text-[11px] uppercase tracking-[0.16em] text-slate-300">
                Continuidad
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="usuario@wrmj.go.cr"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="********"
                  className="w-full rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-60"
              >
                {loading ? "Validando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
