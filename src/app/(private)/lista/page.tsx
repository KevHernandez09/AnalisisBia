// app/plan/lista/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";

type PlanRow = {
  id: string;
  planId?: string;
  planNombre?: string;
  acciones: string;
  marcoLegalidad: string;
  afectacionMarco: string;
  coordinacion: string;
  areaContacto: string;
  requerimientos: string;
  createdAt?: string;
};

const planes = [
  { id: "1", label: "Comisión Institucional de Presupuesto" },
  { id: "2", label: "CISAAL" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PlanListaPage() {
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [openPlan, setOpenPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedPlanLabel =
    selectedPlan && planes.find((p) => p.id === selectedPlan)?.label
      ? planes.find((p) => p.id === selectedPlan)!.label
      : "Seleccione un plan";

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(ev.target as Node)) setOpenPlan(false);
    }

    if (openPlan) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openPlan]);

  // Cargar datos según el plan seleccionado
  useEffect(() => {
    async function load() {
      if (!selectedPlan) {
        setRows([]);
        return;
      }

      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`/api/plan?planId=${selectedPlan}`, {
          cache: "no-store",
        });

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
  }, [selectedPlan]);

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
        .includes(q)
    );
  }, [rows, search]);

  return (
    <section className="relative px-6 pt-6 text-slate-900">
      {/* fondo suave (no tapa tu layout) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute top-24 -left-20 h-72 w-72 rounded-full bg-indigo-300/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-300/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-4">
        {/* Headline */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 p-6 shadow-sm backdrop-blur">
          {/* glow sutil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-white/0 to-sky-100/40" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400" />

          <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Gestión institucional
              </p>

              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
                Planes de Acción
              </h1>
              <p className="text-sm text-slate-600 max-w-xl">
                Consulte las acciones registradas según el plan seleccionado.
              </p>
            </div>

          </div>
        </div>


        {/* Card principal */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 shadow-sm backdrop-blur">
          {/* Header / Toolbar */}
          <div className="relative px-4 py-4 md:px-6">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-700 to-sky-600 opacity-[0.92]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-white/10" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-white">
                  Listado de acciones del plan
                </h2>

                {!selectedPlan ? (
                  <p className="text-xs text-sky-100">
                    Seleccione un plan para visualizar la información.
                  </p>
                ) : (
                  <p className="text-xs text-sky-100">
                    {loading
                      ? "Cargando información…"
                      : `Total: ${rows.length} registro${rows.length === 1 ? "" : "s"
                      } en ${selectedPlanLabel}`}
                  </p>
                )}

                {err ? (
                  <p className="text-xs text-red-100">
                    Error: {err}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {/* Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setOpenPlan((p) => !p)}
                    className={cx(
                      "w-full md:w-72 inline-flex items-center justify-between gap-3",
                      "rounded-2xl border border-white/35 bg-white/10 px-3 py-2.5",
                      "text-xs font-medium text-white md:text-sm",
                      "shadow-sm backdrop-blur transition",
                      "hover:bg-white/15 hover:border-white/60",
                      "focus:outline-none focus:ring-2 focus:ring-white/60"
                    )}
                  >
                    <span className="truncate">{selectedPlanLabel}</span>

                    <svg
                      className={cx(
                        "h-4 w-4 text-white/80 transition-transform",
                        openPlan ? "rotate-180" : "rotate-0"
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {openPlan ? (
                    <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl md:w-72">
                      <div className="max-h-64 overflow-y-auto py-1 text-sm">
                        {planes.map((op) => {
                          const isActive = selectedPlan === op.id;
                          return (
                            <button
                              key={op.id}
                              type="button"
                              className={cx(
                                "w-full text-left px-4 py-2.5 transition",
                                isActive
                                  ? "bg-sky-50 text-sky-800 font-semibold"
                                  : "text-slate-800 hover:bg-slate-50"
                              )}
                              onClick={() => {
                                setSelectedPlan(op.id);
                                setOpenPlan(false);
                              }}
                            >
                              {op.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80"
                      aria-hidden="true"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar en acciones, legalidad, coordinación…"
                      className={cx(
                        "w-full rounded-2xl border border-white/35 bg-white/10",
                        "pl-9 pr-3 py-2.5 text-xs md:text-sm text-white placeholder:text-white/70",
                        "shadow-sm backdrop-blur transition",
                        "focus:outline-none focus:ring-2 focus:ring-white/60",
                        "hover:bg-white/15 hover:border-white/60"
                      )}
                    />
                  </div>

                  {/* Results badge */}
                  <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-white">
                    <Filter size={14} className="text-white/80" />
                    {filteredRows.length} resultado
                    {filteredRows.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block border-t border-slate-200">
            <div className="relative max-h-[560px] overflow-auto">
              <table className="min-w-full text-sm text-slate-700">
                <thead>
                  <tr
                    className={cx(
                      "sticky top-0 z-10",
                      "bg-white/75 backdrop-blur",
                      "text-[11px] font-semibold uppercase tracking-wide",
                      "border-b border-slate-200"
                    )}
                  >
                    <th className="px-4 py-3 text-left">Acciones por ejecutar</th>
                    <th className="px-4 py-3 text-left">Marco de Legalidad</th>
                    <th className="px-4 py-3 text-left">
                      Afectación del Marco de Legalidad
                    </th>
                    <th className="px-4 py-3 text-left">
                      Coordinación interna y/o externa
                    </th>
                    <th className="px-4 py-3 text-left">Área de Contacto</th>
                    <th className="px-4 py-3 text-left">
                      Requerimientos para la intervención
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {!selectedPlan ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-slate-500 bg-white"
                      >
                        Seleccione un plan para ver los registros.
                      </td>
                    </tr>
                  ) : filteredRows.length > 0 ? (
                    filteredRows.map((row, idx) => (
                      <tr
                        key={row.id ?? String(idx)}
                        className={cx(
                          "bg-white transition-colors",
                          idx % 2 === 1 ? "bg-slate-50/50" : "bg-white",
                          "hover:bg-sky-50/70"
                        )}
                      >
                        <td className="px-4 py-3 whitespace-pre-line leading-snug">
                          {row.acciones}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-line leading-snug">
                          {row.marcoLegalidad}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-line leading-snug">
                          {row.afectacionMarco}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-line leading-snug">
                          {row.coordinacion}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-line leading-snug">
                          {row.areaContacto}
                        </td>
                        <td className="px-4 py-3 whitespace-pre-line leading-snug">
                          {row.requerimientos}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-12 text-center text-slate-500 bg-white"
                      >
                        {loading
                          ? "Cargando planes…"
                          : "No hay registros para este plan (o tu búsqueda no coincide)."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="block md:hidden border-t border-slate-200">
            {!selectedPlan ? (
              <div className="px-4 py-10 text-center text-slate-500 bg-white">
                Seleccione un plan para ver los registros.
              </div>
            ) : filteredRows.length > 0 ? (
              <div className="p-4 space-y-4">
                {filteredRows.map((row, idx) => (
                  <article
                    key={row.id ?? String(idx)}
                    className="rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <header className="flex items-start justify-between gap-3">
                      <h3 className="text-[13px] font-semibold text-slate-900">
                        Acciones por ejecutar
                      </h3>

                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600">
                        <Calendar size={12} className="text-slate-500" />
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString("es-CR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                          : "—"}
                      </span>
                    </header>

                    <p className="mt-2 text-[13px] text-slate-800 whitespace-pre-line">
                      {row.acciones}
                    </p>

                    <dl className="mt-3 space-y-3 text-[12px]">
                      <div>
                        <dt className="font-semibold text-slate-700">
                          Marco de Legalidad
                        </dt>
                        <dd className="text-slate-700 whitespace-pre-line">
                          {row.marcoLegalidad || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-semibold text-slate-700">
                          Afectación del Marco de Legalidad
                        </dt>
                        <dd className="text-slate-700 whitespace-pre-line">
                          {row.afectacionMarco || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-semibold text-slate-700">
                          Coordinación interna y/o externa
                        </dt>
                        <dd className="text-slate-700 whitespace-pre-line">
                          {row.coordinacion || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-semibold text-slate-700">
                          Área de Contacto
                        </dt>
                        <dd className="text-slate-700 whitespace-pre-line">
                          {row.areaContacto || "—"}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-semibold text-slate-700">
                          Requerimientos para la intervención
                        </dt>
                        <dd className="text-slate-700 whitespace-pre-line">
                          {row.requerimientos || "—"}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            ) : (
              <div className="px-4 py-10 text-center text-slate-500 bg-white">
                {loading ? "Cargando planes…" : "No hay registros para este plan."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
