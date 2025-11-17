"use client";

import { useEffect, useRef, useState } from "react";

type BiaRow = {
  area: string;
  nombre: string;
  descripcion: string;
  entradas: string;
  salidas: string;
  partes: string;
  sincronizacion: string;
  rto: string;
  mtpd: string;
  rpo: string;
  recursos: string;
  requisitos: string;
  tipoImpacto: string;
  descImpacto: string;
  prioridad: string;
};

export default function AnalisisBIA() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<BiaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const opciones = [
    { id: "1", label: "Todo el departamento" },
    { id: "2", label: "Gerencia General" },
    { id: "3", label: "Gerencia Técnico Operativa" },
    { id: "4", label: "Departamento de Desarrollo Sostenible" },
    { id: "5", label: "Departamento de Tecnologías de información" },
    { id: "6", label: "Departamento de Protocolo" },
    { id: "7", label: "Departamento de Asesoría Legal" },
    { id: "8", label: "Departamento de Prensa Institucional" },
    { id: "9", label: "Departamento de Seguridad Parlamentaria" },
    { id: "10", label: "Departamento de Instituto de Formación e Investigación" },
    { id: "11", label: "Departamento Análisis Presupuestario" },
    { id: "12", label: "Departamento de Comisiones Legislativas" },
    { id: "13", label: "Gerencia Administrativa" },
    { id: "14", label: "Departamento de Financiero" },
    { id: "15", label: "Departamento de Servicios Generales" },
    { id: "16", label: "Departamento de Proveeduría" },
    { id: "17", label: "Departamento de Recursos Humanos" },
    { id: "18", label: "Departamento de Servicios de Salud" },
    { id: "19", label: "Comité Institucional de Emergencias" },
    { id: "20", label: "Departamento de Secretaria del Directorio" },
    { id: "21", label: "Departamento de Servicios Parlamentarios" }, 
    { id: "22", label: "Departamento de Servicios Técnicos" },
  ];

  const filtered = opciones.filter((op) =>
    op.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel =
    opciones.find((i) => i.id === selected)?.label ||
    "Seleccione un departamento...";

  // cerrar dropdown en click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch por departamento seleccionado
  useEffect(() => {
    async function load() {
      if (!selected) {
        setRows([]);
        return;
      }
      try {
        setLoading(true);
        setErr(null);

        const r = await fetch(
          `/api/bia?departamentoId=${encodeURIComponent(selected)}`,
          { cache: "no-store" }
        );

        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.error || "Error al consultar");
        }

        const j = (await r.json()) as { rows: BiaRow[] };
        setRows(j.rows || []);
      } catch (e: any) {
        setErr(e?.message ?? "Error inesperado");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selected]);

  // helper para color de badge de prioridad
  const prioridadColor = (p: string) => {
    const v = p.toLowerCase();
    if (v.includes("alta")) return "bg-red-100 text-red-700 border-red-300";
    if (v.includes("media")) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (v.includes("baja")) return "bg-emerald-100 text-emerald-700 border-emerald-300";
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <section className="text-black">
      <h1 className="text-3xl font-bold mb-2">Mostrar Análisis BIA</h1>

      <p className="text-sm text-gray-600 mb-6">
        Departamento:{" "}
        <span className="font-medium">
          {selected ? selectedLabel : "Ninguno"}
        </span>{" "}
        — Registros:{" "}
        <span className="font-medium">{rows.length}</span>
      </p>

      {/* Combobox Moderno */}
      <div className="relative max-w-xl mb-6" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="
            w-full flex items-center justify-between
            px-4 py-3 rounded-xl bg-white border border-gray-300 shadow-sm
            hover:border-[#0073a4] focus:border-[#0073a4]
            focus:ring-2 focus:ring-[#0073a4]/30 transition-all
            text-left text-[15px] font-medium text-gray-700
          "
        >
          <span>{selectedLabel}</span>

          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div
            className="
              absolute mt-2 w-full bg-white border border-gray-200
              rounded-xl shadow-xl z-10 max-h-64 overflow-hidden
            "
          >
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar departamento..."
                value={search}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300
                  text-gray-700 text-sm transition-all outline-none
                  focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30
                "
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((op) => (
                  <div
                    key={op.id}
                    className={`
                      px-4 py-2.5 cursor-pointer text-sm transition-all
                      ${
                        selected === op.id
                          ? "bg-[#0073a4]/10 text-[#0073a4] font-semibold"
                          : "hover:bg-gray-100"
                      }
                    `}
                    onClick={() => {
                      setSelected(op.id);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {op.label}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No hay coincidencias
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {err && (
        <div className="mb-4 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2">
          {err}
        </div>
      )}

      {loading && (
        <p className="mb-3 text-gray-600">Cargando…</p>
      )}

      {/* 🔥 VISTA MODERNA: TARJETAS EN LUGAR DE TABLA */}
      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((r, index) => (
            <article
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Header de la tarjeta */}
              <header className="px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-slate-50 border-b border-gray-200">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {r.area || "Área no especificada"}
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {r.nombre}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.tipoImpacto && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium bg-sky-50 border-sky-200 text-sky-700">
                      Impacto: {r.tipoImpacto}
                    </span>
                  )}
                  {r.prioridad && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${prioridadColor(
                        r.prioridad
                      )}`}
                    >
                      Prioridad: {r.prioridad}
                    </span>
                  )}
                </div>
              </header>

              {/* Contenido */}
              <div className="px-4 py-3 grid gap-4 md:grid-cols-2">
                {/* Columna izquierda */}
                <div className="space-y-3 text-sm">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Descripción del proceso crítico
                    </h3>
                    <p className="text-slate-800 whitespace-pre-line">
                      {r.descripcion || "Sin descripción registrada."}
                    </p>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Entradas
                      </h3>
                      <p className="text-slate-800 whitespace-pre-line">
                        {r.entradas || "—"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Salidas
                      </h3>
                      <p className="text-slate-800 whitespace-pre-line">
                        {r.salidas || "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Partes interesadas (usuarios)
                    </h3>
                    <p className="text-slate-800 whitespace-pre-line">
                      {r.partes || "—"}
                    </p>
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-3 text-sm">
                  <div className="grid gap-2 md:grid-cols-3">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        RTO
                      </h3>
                      <p className="text-slate-800">{r.rto || "—"}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        MTPD
                      </h3>
                      <p className="text-slate-800">{r.mtpd || "—"}</p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        RPO
                      </h3>
                      <p className="text-slate-800">{r.rpo || "—"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Sincronización con otros procesos
                    </h3>
                    <p className="text-slate-800 whitespace-pre-line">
                      {r.sincronizacion || "—"}
                    </p>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Recursos necesarios
                      </h3>
                      <p className="text-slate-800 whitespace-pre-line">
                        {r.recursos || "—"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Requisitos legales y normativos
                      </h3>
                      <p className="text-slate-800 whitespace-pre-line">
                        {r.requisitos || "—"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                      Descripción del impacto
                    </h3>
                    <p className="text-slate-800 whitespace-pre-line">
                      {r.descImpacto || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 border rounded-xl bg-gray-50 px-4 py-6 text-center text-gray-500 italic">
          {selected
            ? "No hay registros de análisis BIA para este departamento."
            : "Seleccione un departamento para ver datos."}
        </div>
      )}
    </section>
  );
}
