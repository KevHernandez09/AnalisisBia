"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StrategyRow = {
  proceso: string;           // Nombre del Proceso Crítico
  descripcion: string;       // Descripción del Proceso Crítico
  tipo: string;              // Tipo de estrategia
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
    { id: "13", label: "Departamento de __________________" },
    { id: "14", label: "Departamento de Financiero" },
    { id: "15", label: "Departamento de Servicios Generales" },
    { id: "16", label: "Departamento de Proveeduría" },
    { id: "17", label: "Departamento de Recursos Humanos" },
    { id: "18", label: "Departamento de Servicios de Salud" },
    { id: "19", label: "Comité Institucional de Emergencias" },
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

  return (
    <section className="text-black px-6 pt-6">
      <h1 className="text-3xl font-bold mb-2">Estrategias de Continuidad</h1>

      <p className="text-sm text-gray-600 mb-4">
        Departamento: {selected ? selectedLabel : "Ninguno"} — Registros:{" "}
        {rows.length}
      </p>

      {/* Combobox */}
      <div className="relative w-full max-w-lg mb-6" ref={dropdownRef}>
        <div
          className="border border-gray-400 p-3 rounded bg-white cursor-pointer shadow-sm hover:border-gray-500 transition"
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedLabel}
        </div>

        {open && (
          <div className="absolute left-0 right-0 border border-gray-300 bg-white rounded mt-1 w-full max-h-64 overflow-y-auto shadow-lg z-50">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full border-b p-2 outline-none text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />

            {filtered.length > 0 ? (
              filtered.map((op) => (
                <div
                  key={op.id}
                  className={`p-2 cursor-pointer hover:bg-gray-200 ${
                    selected === op.id ? "bg-gray-100 font-semibold" : ""
                  }`}
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
              <div className="p-2 text-gray-600">No hay coincidencias</div>
            )}
          </div>
        )}
      </div>

      {err && (
        <div className="mb-4 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2">
          {err}
        </div>
      )}
      {loading && (
        <p className="mb-3 text-gray-600">Cargando estrategias…</p>
      )}

      {/* Tabla con 4 filas por proceso, como en la plantilla */}
      <div className="mt-4 bg-[#0073a4] border rounded shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[1600px] border-collapse">
            <thead>
              <tr className="bg-[#0073a4]-200 text-white text-[13px]">
                <th className="border px-2 py-2 text-left">
                  Nombre del Proceso Crítico
                </th>
                <th className="border px-2 py-2 text-left">
                  Descripción del Proceso Crítico
                </th>
                <th className="border px-2 py-2 text-left">
                  Tipo de estrategia
                </th>
                <th className="border px-2 py-2 text-left">
                  Estrategias y soluciones de continuidad
                </th>
                <th className="border px-2 py-2 text-left">
                  Asignación de recursos necesarios
                </th>
                <th className="border px-2 py-2 text-left">
                  Asignación de responsabilidades
                </th>
                <th className="border px-2 py-2 text-left">
                  Roles o funciones de los responsables
                </th>
                <th className="border px-2 py-2 text-left">
                  Estructura de respuesta (alertamiento)
                </th>
                <th className="border px-2 py-2 text-left">
                  Actividades a desarrollar en pruebas y simulacros
                </th>
                <th className="border px-2 py-2 text-left">
                  Frecuencias de pruebas y simulacros
                </th>
              </tr>
            </thead>

            <tbody className="text-[13px]">
              {grouped.length > 0 ? (
                grouped.map((g) => {
                  const estrategias = g.estrategias;
                  const rowSpan = estrategias.length || 1;

                  return estrategias.map((e, idx) => (
                    <tr
                      key={`${g.key}-${idx}`}
                      className="odd:bg-white even:bg-gray-50 align-top"
                    >
                      {/* Solo en la primera fila mostramos nombre y descripción con rowSpan */}
                      {idx === 0 && (
                        <>
                          <td
                            className="border px-2 py-2"
                            rowSpan={rowSpan}
                          >
                            {g.proceso}
                          </td>
                          <td
                            className="border px-2 py-2"
                            rowSpan={rowSpan}
                          >
                            {g.descripcion}
                          </td>
                        </>
                      )}

                      {/* Tipo de estrategia en cada fila */}
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.tipo}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.soluciones}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.recursos}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.responsabilidades}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.roles}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.estructura}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.actividades}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {e.frecuencias}
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="border px-4 py-6 text-center text-gray-500 italic bg-gray-50"
                  >
                    {selected
                      ? "No hay estrategias registradas para este departamento."
                      : "Seleccione un departamento para ver estrategias."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
