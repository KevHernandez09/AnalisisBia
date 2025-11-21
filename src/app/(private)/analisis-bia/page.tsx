"use client";

import { useEffect, useRef, useState } from "react";

type BiaRow = {
  id: string;
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
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BiaRow | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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

  const prioridades = ["Alta", "Media", "Baja"];

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
        setOkMsg(null);
        setEditingId(null);
        setDraft(null);

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

  function handleDraftChange<K extends keyof BiaRow>(field: K, value: BiaRow[K]) {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function startEdit(row: BiaRow) {
    setEditingId(row.id);
    setDraft(row);
    setOkMsg(null);
    setErr(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  async function saveEdit() {
    if (!editingId || !draft) return;

    try {
      setSavingId(editingId);
      setErr(null);
      setOkMsg(null);

      // Solo mandamos los campos que realmente existen en ProcesoCritico
      const payload = {
        nombre: draft.nombre,
        descripcion: draft.descripcion,
        entradas: draft.entradas,
        salidas: draft.salidas,
        partes: draft.partes,
        sincronizacion: draft.sincronizacion,
        rto: draft.rto,
        mtpd: draft.mtpd,
        rpo: draft.rpo,
        recursos: draft.recursos,
        requisitos: draft.requisitos,
        descImpacto: draft.descImpacto,
        prioridad: draft.prioridad,
      };

      const res = await fetch(
        `/api/proceso-critico/${encodeURIComponent(editingId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al actualizar");
      }

      // actualizamos el estado local
      setRows((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...draft } : r))
      );

      setOkMsg("Proceso crítico actualizado correctamente.");
      setEditingId(null);
      setDraft(null);
    } catch (e: any) {
      setErr(e?.message ?? "Error inesperado al actualizar");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="text-black">
      <h1 className="text-3xl font-bold mb-2">Análisis BIA</h1>

      <p className="text-sm text-gray-600 mb-3">
        Departamento:{" "}
        <span className="font-medium">
          {selected ? selectedLabel : "Ninguno"}
        </span>{" "}
        — Registros:{" "}
        <span className="font-medium">{rows.length}</span>
      </p>

      {okMsg && (
        <div className="mb-3 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-2 text-sm">
          {okMsg}
        </div>
      )}

      {err && (
        <div className="mb-3 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2 text-sm">
          {err}
        </div>
      )}

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
            className={`w-5 h-5 text-gray-500 transition-transform ${open ? "rotate-180" : "rotate-0"
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
                      ${selected === op.id
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

      {loading && <p className="mb-3 text-gray-600">Cargando…</p>}

      {/* Vista tarjetas con edición */}
      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((r) => {
            const isEditing = editingId === r.id;
            const data = isEditing && draft && draft.id === r.id ? draft : r;

            return (
              <article
                key={r.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Header de la tarjeta */}
                <header className="px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-slate-50 border-b border-gray-200">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {data.area || "Área no especificada"}
                    </p>

                    {isEditing ? (
                      <input
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                        value={data.nombre}
                        onChange={(e) => handleDraftChange("nombre", e.target.value)}
                      />
                    ) : (
                      <h2 className="text-lg font-semibold text-slate-900">
                        {data.nombre}
                      </h2>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {/* tipoImpacto solo lectura, prioridad editable */}
                    {data.tipoImpacto && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium bg-sky-50 border-sky-200 text-sky-700">
                        Impacto: {data.tipoImpacto}
                      </span>
                    )}

                    {isEditing ? (
                      <select
                        className="border border-gray-300 rounded-full px-3 py-1 text-xs"
                        value={data.prioridad}
                        onChange={(e) =>
                          handleDraftChange("prioridad", e.target.value)
                        }
                      >
                        <option value="">Prioridad...</option>
                        {prioridades.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    ) : (
                      data.prioridad && (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold ${prioridadColor(
                            data.prioridad
                          )}`}
                        >
                          Prioridad: {data.prioridad}
                        </span>
                      )
                    )}

                    {/* Botones edición */}
                    <div className="flex items-center gap-2 ml-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={savingId === r.id}
                            className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-60"
                          >
                            {savingId === r.id ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={savingId === r.id}
                            className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(r)}
                          className="px-3 py-1 rounded-md border border-yellow-300 text-xs text-black-700 bg-yellow-50"
                        >
                          Editar
                        </button>
                      )}
                    </div>
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
                      {isEditing ? (
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                          rows={3}
                          value={data.descripcion}
                          onChange={(e) =>
                            handleDraftChange("descripcion", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-slate-800 whitespace-pre-line">
                          {data.descripcion || "Sin descripción registrada."}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          Entradas
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                            rows={2}
                            value={data.entradas}
                            onChange={(e) =>
                              handleDraftChange("entradas", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800 whitespace-pre-line">
                            {data.entradas || "—"}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          Salidas
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                            rows={2}
                            value={data.salidas}
                            onChange={(e) =>
                              handleDraftChange("salidas", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800 whitespace-pre-line">
                            {data.salidas || "—"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Partes interesadas (usuarios)
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                          rows={2}
                          value={data.partes}
                          onChange={(e) =>
                            handleDraftChange("partes", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-slate-800 whitespace-pre-line">
                          {data.partes || "—"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-3 text-sm">
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          RTO
                        </h3>
                        {isEditing ? (
                          <input
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                            value={data.rto}
                            onChange={(e) =>
                              handleDraftChange("rto", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800">{data.rto || "—"}</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          MTPD
                        </h3>
                        {isEditing ? (
                          <input
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                            value={data.mtpd}
                            onChange={(e) =>
                              handleDraftChange("mtpd", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800">{data.mtpd || "—"}</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          RPO
                        </h3>
                        {isEditing ? (
                          <input
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                            value={data.rpo}
                            onChange={(e) =>
                              handleDraftChange("rpo", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800">{data.rpo || "—"}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Sincronización con otros procesos
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                          rows={2}
                          value={data.sincronizacion}
                          onChange={(e) =>
                            handleDraftChange("sincronizacion", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-slate-800 whitespace-pre-line">
                          {data.sincronizacion || "—"}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          Recursos necesarios
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                            rows={2}
                            value={data.recursos}
                            onChange={(e) =>
                              handleDraftChange("recursos", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800 whitespace-pre-line">
                            {data.recursos || "—"}
                          </p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                          Requisitos legales y normativos
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                            rows={2}
                            value={data.requisitos}
                            onChange={(e) =>
                              handleDraftChange("requisitos", e.target.value)
                            }
                          />
                        ) : (
                          <p className="text-slate-800 whitespace-pre-line">
                            {data.requisitos || "—"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-slate-500 uppercase mb-1">
                        Descripción del impacto
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                          rows={3}
                          value={data.descImpacto}
                          onChange={(e) =>
                            handleDraftChange("descImpacto", e.target.value)
                          }
                        />
                      ) : (
                        <p className="text-slate-800 whitespace-pre-line">
                          {data.descImpacto || "—"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
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
