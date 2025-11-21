"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StrategyRow = {
  id: string;            // 👈 NUEVO
  proceso: string;       // Nombre del Proceso Crítico
  descripcion: string;   // Descripción del Proceso Crítico
  tipo: string;          // Tipo de estrategia
  soluciones: string;
  recursos: string;
  responsabilidades: string;
  roles: string;
  estructura: string;
  actividades: string;
  frecuencias: string;
  resultados: string;
  monitoreo: string;
};

type GroupedProcess = {
  key: string;
  proceso: string;
  descripcion: string;
  estrategias: StrategyRow[];
};

export default function EstrategiasContinuidadPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(""); // areaId
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [rows, setRows] = useState<StrategyRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StrategyRow | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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
    { id: "20", label: "Departamento de Secretaria del Directorio" },
    { id: "21", label: "Departamento de Servicios Parlamentarios" },
    { id: "22", label: "Departamento de Servicios Técnicos" },
  ];

  const filtered = opciones.filter((op) =>
    op.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedLabel =
    opciones.find((i) => i.id === selected)?.label ||
    "Seleccione un departamento...";

  // Cerrar dropdown al hacer clic fuera
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

  // Fetch real a /api/estrategias
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
          `/api/estrategias?areaId=${encodeURIComponent(selected)}`,
          { cache: "no-store" },
        );
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.error || "Error al consultar estrategias");
        }

        const j = (await r.json()) as { rows: StrategyRow[] };
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

  // Orden para tipo de estrategia (para que salgan en el orden de la plantilla)
  const tipoOrder = (tipo: string): number => {
    const t = tipo.toLowerCase();
    if (t.includes("prev")) return 1; // prevención
    if (t.includes("conting")) return 2; // contingencia
    if (t.includes("recup")) return 3; // recuperación
    if (t.includes("comun") || t.includes("divulg")) return 4; // comunicación/divulgación
    return 999;
  };

  // Colores por tipo de estrategia
  const tipoBadge = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes("prev"))
      return "bg-sky-100 text-sky-800 border-sky-300";
    if (t.includes("conting"))
      return "bg-amber-100 text-amber-800 border-amber-300";
    if (t.includes("recup"))
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (t.includes("comun") || t.includes("divulg"))
      return "bg-indigo-100 text-indigo-800 border-indigo-300";
    return "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Agrupar por proceso y ordenar las estrategias por tipo
  const grouped = useMemo<GroupedProcess[]>(() => {
    const map = new Map<string, GroupedProcess>();

    for (const r of rows) {
      const key = `${r.proceso}|||${r.descripcion}`;
      let g = map.get(key);
      if (!g) {
        g = { key, proceso: r.proceso, descripcion: r.descripcion, estrategias: [] };
        map.set(key, g);
      }
      g.estrategias.push(r);
    }

    return Array.from(map.values()).map((g) => ({
      ...g,
      estrategias: g.estrategias.sort(
        (a, b) => tipoOrder(a.tipo) - tipoOrder(b.tipo),
      ),
    }));
  }, [rows]);

  // helpers edición
  function handleDraftChange<K extends keyof StrategyRow>(field: K, value: StrategyRow[K]) {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  function startEdit(row: StrategyRow) {
    setEditingId(row.id);
    setDraft(row);
    setErr(null);
    setOkMsg(null);
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
        tipo: draft.tipo,
        soluciones: draft.soluciones,
        recursos: draft.recursos,
        responsabilidades: draft.responsabilidades,
        roles: draft.roles,
        estructura: draft.estructura,
        actividades: draft.actividades,
        frecuencias: draft.frecuencias,
        resultados: draft.resultados,
        monitoreo: draft.monitoreo,
      };

      const res = await fetch(
        `/api/estrategias/${encodeURIComponent(editingId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al actualizar estrategia");
      }

      // actualizar estado local
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId ? { ...row, ...draft } : row,
        ),
      );

      setOkMsg("Estrategia actualizada correctamente.");
      setEditingId(null);
      setDraft(null);
    } catch (e: any) {
      setErr(e?.message ?? "Error inesperado al actualizar");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="text-black px-6 pt-6">
      <h1 className="text-3xl font-bold text-black mb-2">Estrategias de Continuidad</h1>

      <p className="text-sm text-gray-600 mb-2">
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

      {/* 🔥 Combobox Moderno */}
      <div className="relative w-full max-w-lg mb-6" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
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
          <div className="absolute left-0 right-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden z-50">
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Buscar departamento..."
                className="
                  w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300
                  text-gray-700 text-sm outline-none
                  focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30
                  transition-all
                "
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
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

      {loading && (
        <p className="mb-3 text-gray-600">Cargando estrategias…</p>
      )}

      {/* 🔥 VISTA MODERNA: TARJETAS POR PROCESO */}
      {grouped.length > 0 ? (
        <div className="space-y-5">
          {grouped.map((g) => (
            <article
              key={g.key}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Header proceso */}
              <header className="px-4 py-3 border-b border-gray-200 bg-[#0073a4]">
                <p className="text-xs font-semibold uppercase tracking-wide text-white mb-1">
                  Proceso crítico
                </p>
                <h2 className="text-lg font-semibold text-white">
                  {g.proceso || "Sin nombre de proceso"}
                </h2>
                {g.descripcion && (
                  <p className="mt-1 text-sm text-white whitespace-pre-line">
                    {g.descripcion}
                  </p>
                )}
              </header>

              {/* Lista de estrategias */}
              <div className="px-4 py-3 space-y-3">
                {g.estrategias.map((e) => {
                  const isEditing = editingId === e.id;
                  const data =
                    isEditing && draft && draft.id === e.id ? draft : e;

                  return (
                    <div
                      key={e.id}
                      className="rounded-lg border border-gray-200 bg-slate-50/60 px-3 py-3"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-[#0073a4]">
                                Estrategia
                              </p>
                            </div>

                            {/* Botones edición */}
                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={saveEdit}
                                    disabled={savingId === e.id}
                                    className="px-3 py-1 rounded-md bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 disabled:opacity-60"
                                  >
                                    {savingId === e.id ? "Guardando..." : "Guardar"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={savingId === e.id}
                                    className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEdit(e)}
                                  className="px-3 py-1 rounded-md border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                                >
                                  Editar
                                </button>
                              )}
                            </div>
                          </div>

                          {/* soluciones */}
                          {isEditing ? (
                            <textarea
                              className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                              rows={3}
                              value={data.soluciones}
                              onChange={(ev) =>
                                handleDraftChange("soluciones", ev.target.value)
                              }
                            />
                          ) : (
                            <p className="text-sm text-slate-800 whitespace-pre-line">
                              {data.soluciones || "Sin descripción de estrategia."}
                            </p>
                          )}
                        </div>

                        {/* tipo de estrategia */}
                        <div className="mt-2 md:mt-0 md:ml-3 flex flex-col items-start gap-2">
                          <span
                            className={`
                              inline-flex items-center px-3 py-1 rounded-full border
                              text-xs font-semibold
                              ${tipoBadge(data.tipo)}
                            `}
                          >
                            {isEditing ? (
                              <input
                                className="bg-transparent outline-none text-xs"
                                value={data.tipo}
                                onChange={(ev) =>
                                  handleDraftChange("tipo", ev.target.value)
                                }
                              />
                            ) : (
                              data.tipo
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 text-sm">
                        <div className="space-y-2">
                          {/* Recursos */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Recursos necesarios
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.recursos}
                                onChange={(ev) =>
                                  handleDraftChange("recursos", ev.target.value)
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.recursos || "—"}
                              </p>
                            )}
                          </div>

                          {/* Responsables */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Responsables
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.responsabilidades}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "responsabilidades",
                                    ev.target.value,
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.responsabilidades || "—"}
                              </p>
                            )}
                          </div>

                          {/* Roles */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Roles o funciones
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.roles}
                                onChange={(ev) =>
                                  handleDraftChange("roles", ev.target.value)
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.roles || "—"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {/* Estructura */}
                          <div>
                            <h3 className="text-xs font-semibold text-[#0073a4] uppercase mb-1">
                              Estructura de respuesta (alertamiento)
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.estructura}
                                onChange={(ev) =>
                                  handleDraftChange("estructura", ev.target.value)
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.estructura || "—"}
                              </p>
                            )}
                          </div>

                          {/* Actividades */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Actividades en pruebas y simulacros
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.actividades}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "actividades",
                                    ev.target.value,
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.actividades || "—"}
                              </p>
                            )}
                          </div>

                          {/* Frecuencias */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Frecuencia de pruebas / simulacros
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.frecuencias}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "frecuencias",
                                    ev.target.value,
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.frecuencias || "—"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {(data.resultados || data.monitoreo) && (
                        <div className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
                          {/* Resultados */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Resultados de pruebas / simulacros
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.resultados}
                                onChange={(ev) =>
                                  handleDraftChange("resultados", ev.target.value)
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.resultados || "—"}
                              </p>
                            )}
                          </div>

                          {/* Monitoreo */}
                          <div>
                            <h3 className="text-xs font-semibold  text-[#0073a4] uppercase mb-1">
                              Monitoreo y mejora continua
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm resize-y"
                                rows={2}
                                value={data.monitoreo}
                                onChange={(ev) =>
                                  handleDraftChange("monitoreo", ev.target.value)
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.monitoreo || "—"}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 border rounded-xl bg-gray-50 px-4 py-6 text-center text-gray-500 italic">
          {selected
            ? "No hay estrategias registradas para este departamento."
            : "Seleccione un departamento para ver estrategias."}
        </div>
      )}
    </section>
  );
}
