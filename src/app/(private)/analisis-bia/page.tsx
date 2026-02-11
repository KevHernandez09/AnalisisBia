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
    {
      id: "10",
      label: "Departamento de Instituto de Formación e Investigación",
    },
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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

  // helper para color de badge de prioridad (MISMO esquema que el original)
  const prioridadColor = (p: string) => {
    const v = p.toLowerCase();
    if (v.includes("alta")) {
      // fondo rosado suave + rojo
      return "bg-red-100 text-red-700 border-red-300";
    }
    if (v.includes("media")) {
      // fondo amarillo suave
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
    if (v.includes("baja")) {
      // fondo verde suave
      return "bg-emerald-100 text-emerald-700 border-emerald-300";
    }
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
    <section className="px-6 pt-6 pb-10">
      {/* Header*/}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 px-5 py-5 shadow-sm backdrop-blur md:px-6">
        {/* Accent + glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/0 to-sky-100/40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 opacity-90" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />

        {/* Content */}
        <div className="relative">
          <div className="inline-flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-cyan-200/70 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-800">
              Módulo de Visualización de Procesos Críticos
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Procesos críticos por departamento
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Visualice y actualice los procesos críticos asociados a cada departamento,
            incluyendo parámetros de impacto, tiempos objetivo y recursos necesarios.
          </p>

          {/* divider sutil */}
          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
        </div>
      </div>


      {/* Mensajes de estado */}
      {okMsg && (
        <div className="mb-3 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 px-3 py-2 text-sm">
          {okMsg}
        </div>
      )}

      {err && (
        <div className="mb-3 rounded-xl bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
          {err}
        </div>
      )}

      {/* Card de filtro / combo de departamento */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Filtro por departamento
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Seleccione un departamento para consultar sus procesos críticos.
            </p>
          </div>

          {/* Combobox Moderno */}
          <div className="relative w-full md:w-80" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className="
                w-full flex items-center justify-between
                px-4 py-2.5 rounded-xl bg-white border border-slate-300 shadow-xs
                hover:border-cyan-600 focus:border-cyan-600
                focus:ring-2 focus:ring-cyan-500/20 transition-all
                text-left text-[14px] font-medium text-slate-700
              "
            >
              <span className="truncate">{selectedLabel}</span>

              <svg
                className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : "rotate-0"
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

            {open && (
              <div
                className="
                  absolute mt-2 w-full bg-white border border-slate-200
                  rounded-xl shadow-xl z-20 max-h-64 overflow-hidden
                "
              >
                <div className="p-2 border-b border-slate-200 bg-slate-50/60">
                  <input
                    type="text"
                    placeholder="Buscar departamento..."
                    value={search}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                      w-full px-3 py-2 rounded-lg bg-white border border-slate-300
                      text-slate-700 text-xs outline-none
                      focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30
                    "
                  />
                </div>

                <div className="max-h-56 overflow-y-auto">
                  {filtered.length > 0 ? (
                    filtered.map((op) => (
                      <button
                        key={op.id}
                        type="button"
                        className={`
                          w-full text-left px-4 py-2.5 text-xs
                          transition-all
                          ${selected === op.id
                            ? "bg-cyan-50 text-cyan-700 font-semibold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                        onClick={() => {
                          setSelected(op.id);
                          setOpen(false);
                          setSearch("");
                        }}
                      >
                        {op.label}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 text-xs">
                      No hay coincidencias.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <p className="mb-3 text-slate-600 text-sm">Cargando procesos…</p>
      )}

      {/* Vista tarjetas con edición */}
      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((r) => {
            const isEditing = editingId === r.id;
            const data = isEditing && draft && draft.id === r.id ? draft : r;

            return (
              <article
                key={r.id}
                className="bg-white/90 border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Header de la tarjeta */}
                <header className="px-4 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between bg-[#0073A4] text-white rounded-t-xl">

                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white-500">
                      {data.area || "Área no especificada"}
                    </p>

                    {isEditing ? (
                      <input
                        className="w-full border border-white-300 rounded-md px-2 py-1 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        value={data.nombre}
                        onChange={(e) =>
                          handleDraftChange("nombre", e.target.value)
                        }
                      />
                    ) : (
                      <h2 className="text-base md:text-lg font-semibold text-white">
                        {data.nombre}
                      </h2>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    {data.tipoImpacto && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-medium bg-sky-50 border-sky-200 text-sky-700">
                        Impacto: {data.tipoImpacto}
                      </span>
                    )}

                    {isEditing ? (
                      <select
                        className="border border-slate-300 rounded-full px-3 py-1 text-[11px] text-slate-700 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                        value={data.prioridad ?? ""}
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
                          className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-semibold ${prioridadColor(
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
                            className="px-3 py-1 rounded-md bg-[#0073a4] text-white text-[11px] font-semibold hover:bg-[#0087c4] disabled:opacity-60"
                          >
                            {savingId === r.id ? "Guardando..." : "Guardar"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={savingId === r.id}
                            className="px-3 py-1 rounded-md border border-slate-300 text-[11px] text-slate-700 hover:bg-slate-50"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(r)}
                          className="px-3 py-1 rounded-md border border-amber-300 text-[11px] text-amber-800 bg-amber-50 hover:bg-amber-100"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </header>

                {/* Contenido */}
                <div className="px-4 py-4 grid gap-4 md:grid-cols-2">
                  {/* Columna izquierda */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Descripción del proceso crítico
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          Entradas
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          Salidas
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                      <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Partes interesadas (usuarios)
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          RTO
                        </h3>
                        {isEditing ? (
                          <input
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          MTPD
                        </h3>
                        {isEditing ? (
                          <input
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          RPO
                        </h3>
                        {isEditing ? (
                          <input
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                      <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Sincronización con otros procesos
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                          rows={2}
                          value={data.sincronizacion}
                          onChange={(e) =>
                            handleDraftChange(
                              "sincronizacion",
                              e.target.value
                            )
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          Recursos necesarios
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                        <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          Requisitos legales y normativos
                        </h3>
                        {isEditing ? (
                          <textarea
                            className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                      <h3 className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                        Descripción del impacto
                      </h3>
                      {isEditing ? (
                        <textarea
                          className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-500 text-sm italic">
          {selected
            ? "No hay registros de análisis BIA para este departamento."
            : "Seleccione un departamento para visualizar los procesos críticos asociados."}
        </div>
      )}
    </section>
  );
}
