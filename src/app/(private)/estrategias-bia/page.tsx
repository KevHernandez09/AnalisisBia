"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StrategyRow = {
  id: string;
  proceso: string;
  descripcion: string;
  tipo: string;
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

  const filtered = opciones.filter((op) =>
    op.label.toLowerCase().includes(search.toLowerCase())
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
          { cache: "no-store" }
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

  // Colores por tipo de estrategia (estos se mantienen, ya los usábamos en el otro módulo)
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
        g = {
          key,
          proceso: r.proceso,
          descripcion: r.descripcion,
          estrategias: [],
        };
        map.set(key, g);
      }
      g.estrategias.push(r);
    }

    return Array.from(map.values()).map((g) => ({
      ...g,
      estrategias: g.estrategias.sort(
        (a, b) => tipoOrder(a.tipo) - tipoOrder(b.tipo)
      ),
    }));
  }, [rows]);

  // helpers edición
  function handleDraftChange<K extends keyof StrategyRow>(
    field: K,
    value: StrategyRow[K]
  ) {
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
        }
      );

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al actualizar estrategia");
      }

      // actualizar estado local
      setRows((prev) =>
        prev.map((row) => (row.id === editingId ? { ...row, ...draft } : row))
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
    <section className="px-6 pt-6 pb-10">
      {/* Header principal en card */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 px-5 py-5 shadow-sm backdrop-blur md:px-6">
        {/* Accent + glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/0 to-sky-100/40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 opacity-90" />
        <div className="pointer-events-none absolute -top-24 left-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          {/* Left: title */}
          <div className="space-y-2">
            <div className="inline-flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-cyan-200/70 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-800">
                Módulo de Estrategias de continuidad
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
              Estrategias de Continuidad
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              Revise y actualice las estrategias de prevención, contingencia,
              recuperación y comunicación asociadas a los procesos críticos de cada
              departamento.
            </p>
          </div>
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

      {/* Combobox Moderno */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Estrategias por departamento
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md">
              Seleccione un departamento para consultar y gestionar las
              estrategias de continuidad asociadas a sus procesos críticos.
            </p>
          </div>

          <div className="relative w-full md:w-80" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
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
                  absolute left-0 right-0 mt-2 w-full bg-white border border-slate-200
                  rounded-xl shadow-xl max-h-64 overflow-hidden z-50
                "
              >
                <div className="p-2 border-b border-slate-200 bg-slate-50/60">
                  <input
                    type="text"
                    placeholder="Buscar departamento..."
                    className="
                      w-full px-3 py-2 rounded-lg bg-white border border-slate-300
                      text-slate-700 text-xs outline-none
                      focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30
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
                      No hay coincidencias
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <p className="mb-3 text-slate-600 text-sm">Cargando estrategias…</p>
      )}

      {/* Vista moderna: tarjetas por proceso */}
      {grouped.length > 0 ? (
        <div className="space-y-5">
          {grouped.map((g) => (
            <article
              key={g.key}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Header proceso */}
              <header className="px-4 py-3 border-b border-slate-200 bg-[#0073a4]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100 mb-1">
                  Proceso crítico
                </p>
                <h2 className="text-lg font-semibold text-white">
                  {g.proceso || "Sin nombre de proceso"}
                </h2>
                {g.descripcion && (
                  <p className="mt-1 text-sm text-cyan-50 whitespace-pre-line">
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
                      className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700">
                                Estrategia
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={saveEdit}
                                    disabled={savingId === e.id}
                                    className="px-3 py-1 rounded-md bg-cyan-600 text-white text-[11px] font-semibold hover:bg-cyan-500 disabled:opacity-60"
                                  >
                                    {savingId === e.id
                                      ? "Guardando..."
                                      : "Guardar"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={savingId === e.id}
                                    className="px-3 py-1 rounded-md border border-slate-300 text-[11px] text-slate-700 hover:bg-slate-50"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => startEdit(e)}
                                  className="px-3 py-1 rounded-md border border-slate-300 text-[11px] text-slate-700 hover:bg-slate-50"
                                >
                                  Editar
                                </button>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <textarea
                              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                              rows={3}
                              value={data.soluciones}
                              onChange={(ev) =>
                                handleDraftChange(
                                  "soluciones",
                                  ev.target.value
                                )
                              }
                            />
                          ) : (
                            <p className="text-sm text-slate-800 whitespace-pre-line">
                              {data.soluciones ||
                                "Sin descripción de estrategia."}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 md:mt-0 md:ml-3 flex flex-col items-start gap-2">
                          <span
                            className={`
                              inline-flex items-center px-3 py-1 rounded-full border
                              text-[11px] font-semibold
                              ${tipoBadge(data.tipo)}
                            `}
                          >
                            {isEditing ? (
                              <input
                                className="bg-transparent outline-none text-[11px]"
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
                          <div>
                            <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                              Recursos necesarios
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                rows={2}
                                value={data.recursos}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "recursos",
                                    ev.target.value
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.recursos || "—"}
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                              Responsables
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                rows={2}
                                value={data.responsabilidades}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "responsabilidades",
                                    ev.target.value
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.responsabilidades || "—"}
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                              Roles o funciones
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
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
                          <div>
                            <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                              Estructura de respuesta (alertamiento)
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                rows={2}
                                value={data.estructura}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "estructura",
                                    ev.target.value
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.estructura || "—"}
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                              Actividades en pruebas y simulacros
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                rows={2}
                                value={data.actividades}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "actividades",
                                    ev.target.value
                                  )
                                }
                              />
                            ) : (
                              <p className="text-slate-800 whitespace-pre-line">
                                {data.actividades || "—"}
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                              Frecuencia de pruebas / simulacros
                            </h3>
                            {isEditing ? (
                              <textarea
                                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                                rows={2}
                                value={data.frecuencias}
                                onChange={(ev) =>
                                  handleDraftChange(
                                    "frecuencias",
                                    ev.target.value
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

                      <div className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
                        <div>
                          <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                            Resultados de pruebas / simulacros
                          </h3>
                          {isEditing ? (
                            <textarea
                              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                              rows={2}
                              value={data.resultados}
                              onChange={(ev) =>
                                handleDraftChange(
                                  "resultados",
                                  ev.target.value
                                )
                              }
                            />
                          ) : (
                            <p className="text-slate-800 whitespace-pre-line">
                              {data.resultados || "—"}
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-[11px] font-semibold text-cyan-700 uppercase mb-1">
                            Monitoreo y mejora continua
                          </h3>
                          {isEditing ? (
                            <textarea
                              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm text-slate-800 resize-y outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                              rows={2}
                              value={data.monitoreo}
                              onChange={(ev) =>
                                handleDraftChange(
                                  "monitoreo",
                                  ev.target.value
                                )
                              }
                            />
                          ) : (
                            <p className="text-slate-800 whitespace-pre-line">
                              {data.monitoreo || "—"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-slate-500 text-sm italic">
          {selected
            ? "No hay estrategias registradas para este departamento."
            : "Seleccione un departamento para ver estrategias de continuidad."}
        </div>
      )}
    </section>
  );
}
