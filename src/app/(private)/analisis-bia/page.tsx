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

  return (
    <section className="text-black">
      <h1 className="text-3xl font-bold mb-6">Mostrar Análisis BIA</h1>

      <p className="text-sm text-gray-600 mb-4">
        Departamento: {selected ? selectedLabel : "Ninguno"} — Registros: {rows.length}
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

      {/* TABLA */}
      <div className="w-full overflow-x-auto border rounded">
        <table className="min-w-[1200px] w-full border-collapse">
          <thead>
            <tr className="bg-[#0073a4] text-white text-[13px]">
              <th className="border px-2 py-2 text-left">
                Área de la Gerencia o Departamento
              </th>
              <th className="border px-2 py-2 text-left">
                Nombre del Proceso Crítico
              </th>
              <th className="border px-2 py-2 text-left">
                Descripción
              </th>
              <th className="border px-2 py-2 text-left">Entradas</th>
              <th className="border px-2 py-2 text-left">Salidas</th>
              <th className="border px-2 py-2 text-left">Partes interesadas</th>
              <th className="border px-2 py-2 text-left">Sincronización</th>
              <th className="border px-2 py-2 text-center" colSpan={3}>
                Marco de tiempo de recuperación
              </th>
              <th className="border px-2 py-2 text-left">Recursos</th>
              <th className="border px-2 py-2 text-left">Requisitos</th>
              <th className="border px-2 py-2 text-left">Tipo impacto</th>
              <th className="border px-2 py-2 text-left">Descripción impacto</th>
              <th className="border px-2 py-2 text-left">Prioridad</th>
            </tr>

            <tr className="bg-[#0073a4] text-white text-[12px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <th key={i} className="border px-2 py-1"></th>
              ))}
              <th className="border px-2 py-1 text-center">RTO</th>
              <th className="border px-2 py-1 text-center">MTPD</th>
              <th className="border px-2 py-1 text-center">RPO</th>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={`sub-${i}`} className="border px-2 py-1"></th>
              ))}
            </tr>
          </thead>

          <tbody className="text-[13px]">
            {rows.length > 0 ? (
              rows.map((r, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-2">{r.area}</td>
                  <td className="border px-2 py-2">{r.nombre}</td>
                  <td className="border px-2 py-2">{r.descripcion}</td>
                  <td className="border px-2 py-2">{r.entradas}</td>
                  <td className="border px-2 py-2">{r.salidas}</td>
                  <td className="border px-2 py-2">{r.partes}</td>
                  <td className="border px-2 py-2">{r.sincronizacion}</td>
                  <td className="border px-2 py-2 text-center">{r.rto}</td>
                  <td className="border px-2 py-2 text-center">{r.mtpd}</td>
                  <td className="border px-2 py-2 text-center">{r.rpo}</td>
                  <td className="border px-2 py-2">{r.recursos}</td>
                  <td className="border px-2 py-2">{r.requisitos}</td>
                  <td className="border px-2 py-2">{r.tipoImpacto}</td>
                  <td className="border px-2 py-2">{r.descImpacto}</td>
                  <td className="border px-2 py-2">{r.prioridad}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={15}
                  className="border px-4 py-6 text-center text-gray-500 italic bg-gray-50"
                >
                  {selected
                    ? "No hay registros de análisis BIA para este departamento."
                    : "Seleccione un departamento para ver datos."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
