// app/plan/lista/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type PlanRow = {
  id: string;
  acciones: string;
  marcoLegalidad: string;
  afectacionMarco: string;
  coordinacion: string;
  areaContacto: string;
  requerimientos: string;
  createdAt?: string;
};

export default function PlanListaPage() {
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch("/api/plan", { cache: "no-store" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error || "Error al consultar los planes");
        }

        const j = (await res.json()) as { items: PlanRow[] } | PlanRow[];
        const data = Array.isArray(j) ? j : j.items ?? [];
        setRows(data);
      } catch (e: any) {
        setErr(e?.message ?? "Error inesperado");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      [
        r.acciones,
        r.marcoLegalidad,
        r.afectacionMarco,
        r.coordinacion,
        r.areaContacto,
        r.requerimientos,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, search]);

  return (
    <section className="px-4 py-8 md:px-8 text-black">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Planes de Intervención
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consulta las acciones, marco de legalidad, coordinación y
            requerimientos definidos para cada plan.
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80 overflow-hidden">
          {/* Header de la card */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-sky-700 to-sky-600 text-white">
            <div>
              <h2 className="text-lg font-semibold">
                Listado de planes registrados
              </h2>
              <p className="text-xs md:text-[13px] text-sky-100 mt-0.5">
                {loading
                  ? "Cargando información…"
                  : `Total: ${rows.length} plan${
                      rows.length === 1 ? "" : "es"
                    } registrados`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por acciones, área, marco..."
                  className="w-64 max-w-xs rounded-full bg-white/10 border border-white/40 px-9 py-1.5 text-xs md:text-sm placeholder-white/70 text-white outline-none focus:bg-white/15 focus:border-white focus:ring-1 focus:ring-white/80 transition"
                />
                <span className="absolute left-2.5 top-1.5 md:top-1.5 text-xs md:text-sm text-white/80">
                  🔍
                </span>
              </div>

              <span className="hidden md:inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                {filteredRows.length} resultado
                {filteredRows.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* Contenedor scrollable de la tabla */}
          <div className="relative max-h-[540px] overflow-auto">
            <table className="min-w-[1200px] w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="text-[11px] md:text-[12px] uppercase tracking-[0.08em] bg-slate-50 text-slate-700 border-b border-slate-200">
                  <th className="border-r border-slate-200 px-2 py-2 text-left">
                    #
                  </th>
                  <th className="border-r border-slate-200 px-3 py-2 text-left">
                    Acciones por ejecutar
                  </th>
                  <th className="border-r border-slate-200 px-3 py-2 text-left">
                    Marco de Legalidad
                  </th>
                  <th className="border-r border-slate-200 px-3 py-2 text-left">
                    Afectación del Marco de Legalidad
                  </th>
                  <th className="border-r border-slate-200 px-3 py-2 text-left">
                    Coordinación interna y/o externa
                  </th>
                  <th className="border-r border-slate-200 px-3 py-2 text-left">
                    Área de Contacto
                  </th>
                  <th className="border-r border-slate-200 px-3 py-2 text-left">
                    Requerimientos para la intervención
                  </th>
                  <th className="px-3 py-2 text-left">Fecha de registro</th>
                </tr>
              </thead>

              <tbody className="text-[12px] md:text-[13px]">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={row.id ?? idx}
                      className="align-top odd:bg-white even:bg-slate-50/70 hover:bg-sky-50 transition-colors"
                    >
                      <td className="border-t border-slate-200 border-r px-2 py-2 text-slate-500 text-center text-xs">
                        {idx + 1}
                      </td>

                      <td className="border-t border-slate-200 border-r px-3 py-2 whitespace-pre-line leading-snug">
                        {row.acciones}
                      </td>
                      <td className="border-t border-slate-200 border-r px-3 py-2 whitespace-pre-line leading-snug">
                        {row.marcoLegalidad}
                      </td>
                      <td className="border-t border-slate-200 border-r px-3 py-2 whitespace-pre-line leading-snug">
                        {row.afectacionMarco}
                      </td>
                      <td className="border-t border-slate-200 border-r px-3 py-2 whitespace-pre-line leading-snug">
                        {row.coordinacion}
                      </td>
                      <td className="border-t border-slate-200 border-r px-3 py-2 whitespace-pre-line leading-snug">
                        {row.areaContacto}
                      </td>
                      <td className="border-t border-slate-200 border-r px-3 py-2 whitespace-pre-line leading-snug">
                        {row.requerimientos}
                      </td>
                      <td className="border-t border-slate-200 px-3 py-2 text-slate-600 whitespace-nowrap text-xs md:text-[12px]">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString("es-CR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="border-t border-slate-200 px-4 py-8 text-center text-slate-500 text-sm bg-white"
                    >
                      {loading
                        ? "Cargando planes de acción"
                        : search
                        ? "No hay planes que coincidan con el criterio de búsqueda."
                        : "No hay planes de acción registrados aún."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
