// app/plan/lista/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  { id: "2", label: "CISAAL"},
];

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
      if (!dropdownRef.current.contains(ev.target as Node)) {
        setOpenPlan(false);
      }
    }

    if (openPlan) {
      document.addEventListener("mousedown", handleClickOutside);
    }
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
        .includes(q),
    );
  }, [rows, search]);

  return (
    <section className="text-black px-6 pt-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Planes de Acción
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consulte las acciones registradas según el plan seleccionado.
          </p>
        </div>

        {/* Card principal */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/80 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 md:px-6 py-4 bg-gradient-to-r from-sky-700 to-sky-600 text-white">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">
                Listado de acciones del plan
              </h2>
              {selectedPlan ? (
                <p className="text-xs md:text-[13px] text-sky-100">
                  {loading
                    ? "Cargando información…"
                    : `Total: ${rows.length} registro${rows.length === 1 ? "" : "s"
                    } en ${selectedPlanLabel}`}
                </p>
              ) : (
                <p className="text-xs text-sky-200">
                  Seleccione un plan para visualizar la información.
                </p>
              )}

              {err && <p className="text-xs text-red-100">Error: {err}</p>}
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              {/* Combobox minimalista */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setOpenPlan((p) => !p)}
                  className="
                    w-full md:w-64 flex items-center justify-between
                    px-3 py-2.5 rounded-full bg-white/10 border border-white/40
                    hover:bg-white/15 hover:border-white/80
                    focus:outline-none focus:ring-2 focus:ring-white/60
                    text-xs md:text-sm font-medium text-white
                    transition-all
                  "
                >
                  <span className="truncate">{selectedPlanLabel}</span>

                  <svg
                    className={`w-4 h-4 text-white/80 transition-transform ${openPlan ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openPlan && (
                  <div
                    className="
                      absolute mt-2 w-full md:w-64 bg-white border border-gray-200
                      rounded-xl shadow-xl z-20 max-h-64 overflow-hidden
                    "
                  >
                    <div className="max-h-56 overflow-y-auto text-sm">
                      {planes.map((op) => (
                        <div
                          key={op.id}
                          className={`
                            px-4 py-2.5 cursor-pointer transition-all
                            ${selectedPlan === op.id
                              ? "bg-sky-50 text-sky-700 font-semibold"
                              : "hover:bg-gray-100 text-gray-800"
                            }
                          `}
                          onClick={() => {
                            setSelectedPlan(op.id);
                            setOpenPlan(false);
                          }}
                        >
                          {op.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Buscador dentro del plan seleccionado */}
              <div className="flex items-center gap-3">
                <span className="hidden md:inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.12em]">
                  {filteredRows.length} resultado
                  {filteredRows.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop: tabla moderna */}
          <div className="hidden md:block relative max-h-[540px] overflow-auto rounded-xl border-t border-slate-200">
            <table className="min-w-full text-sm text-slate-700">
              <thead>
                <tr
                  className="
                    bg-white/70 backdrop-blur
                    sticky top-0 z-10
                    text-[11px] font-semibold uppercase tracking-wide
                    border-b border-slate-200
                  "
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
                      colSpan={7}
                      className="px-4 py-10 text-center text-slate-500 text-sm bg-white"
                    >
                      Seleccione un plan para ver los registros.
                    </td>
                  </tr>
                ) : filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={row.id ?? idx}
                      className="hover:bg-sky-50/60 transition-colors bg-white"
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
                      colSpan={7}
                      className="px-4 py-10 text-center text-slate-500 text-sm bg-white"
                    >
                      {loading
                        ? "Cargando planes…"
                        : "No hay registros para este plan."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards en lugar de tabla */}
          <div className="block md:hidden border-t border-slate-200">
            {!selectedPlan ? (
              <div className="px-4 py-8 text-center text-slate-500 text-sm bg-white">
                Seleccione un plan para ver los registros.
              </div>
            ) : filteredRows.length > 0 ? (
              <div className="p-4 space-y-4">
                {filteredRows.map((row, idx) => (
                  <article
                    key={row.id ?? idx}
                    className="
                      rounded-xl border border-slate-200 bg-white
                      shadow-xs shadow-slate-200/70
                      p-4 space-y-3
                    "
                  >
                    <header className="flex items-start justify-between gap-3">
                      <h3 className="text-[13px] font-semibold text-slate-900">
                        Acciones por ejecutar
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString("es-CR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                          : "—"}
                      </span>
                    </header>

                    <p className="text-[13px] text-slate-800 whitespace-pre-line">
                      {row.acciones}
                    </p>

                    <dl className="space-y-2 text-[12px]">
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
              <div className="px-4 py-8 text-center text-slate-500 text-sm bg-white">
                {loading
                  ? "Cargando planes…"
                  : "No hay registros para este plan."}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
