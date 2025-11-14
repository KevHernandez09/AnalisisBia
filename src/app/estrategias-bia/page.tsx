"use client";

import { useEffect, useRef, useMemo, useState } from "react";

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

export default function EstrategiasContinuidadPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);
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
    { id: "13", label: "Departamento de __________________" },
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
    opciones.find((i) => i.id === selected)?.label || "Seleccione un proceso...";

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

  // === Datos de ejemplo (reemplaza con fetch a tu API) ===
  const dataByDept: Record<string, StrategyRow[]> = {
    "2": [
      {
        proceso: "Gestión de Recursos Humanos",
        descripcion: "Coordina la respuesta institucional ante incidentes que afecten personal y operaciones.",
        tipo: "Estrategias de prevención",
        soluciones: "Capacitaciones y políticas de continuidad.",
        recursos: "Presupuesto anual; LMS.",
        responsabilidades: "Dirección RRHH; Jefaturas.",
        roles: "Líder de continuidad; supervisores.",
        estructura: "Alerta por correo y Teams.",
        actividades: "Simulacros trimestrales.",
        frecuencias: "Trimestral",
        resultados: "RTO cumplido en 80% de pruebas.",
        monitoreo: "KPIs y lecciones aprendidas.",
      },
      {
        proceso: "Gestión de Recursos Humanos",
        descripcion: "Coordina la respuesta institucional ante incidentes que afecten personal y operaciones.",
        tipo: "Estrategias de recuperación",
        soluciones: "Plan de reincorporación y reubicación temporal.",
        recursos: "Mesa de ayuda; herramientas de ticketing.",
        responsabilidades: "RRHH + TI.",
        roles: "Coordinador de reincorporación.",
        estructura: "Escalamiento a CIE en 30 min.",
        actividades: "Pruebas de acceso remoto.",
        frecuencias: "Semestral",
        resultados: "90% de reincorporación < 48h.",
        monitoreo: "Reportes post-incidente.",
      },
      {
        proceso: "Gestión de Activos TI",
        descripcion: "Asegura disponibilidad de servicios críticos de TI.",
        tipo: "Estrategias de contingencia",
        soluciones: "Failover a región secundaria.",
        recursos: "Infraestructura en alta disponibilidad.",
        responsabilidades: "Área de TI.",
        roles: "On-call; SRE.",
        estructura: "PagerDuty; runbooks.",
        actividades: "GameDays; DR test.",
        frecuencias: "Anual",
        resultados: "RPO < 4h alcanzado.",
        monitoreo: "Dashboards y alertas.",
      },
    ],
  };

  const all = dataByDept[selected] ?? [];

  // Orden definido del tipo de estrategia
  const tipoOrder: Record<string, number> = {
    "Estrategias de prevención": 1,
    "Estrategias de contingencia": 2,
    "Estrategias de recuperación": 3,
    "Estrategias de comunicación/divulgación": 4,
  };

  // Agrupar por proceso + descripción y ordenar cada grupo por tipo
  const grouped = useMemo(() => {
    const map = new Map<string, StrategyRow[]>();
    for (const r of all) {
      const key = `${r.proceso}|||${r.descripcion}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    // ordenar cada grupo por tipo según la plantilla
    for (const [k, arr] of map) {
      arr.sort(
        (a, b) => (tipoOrder[a.tipo] ?? 999) - (tipoOrder[b.tipo] ?? 999)
      );
      map.set(k, arr);
    }
    return Array.from(map.entries()); // [ [key, rows[]], ... ]
  }, [all]);

  return (
    <section className="text-black">
      <h1 className="text-3xl font-bold mb-6">Estrategias de Continuidad</h1>

      {/* Combobox */}
      <div className="relative max-w-xl mb-6" ref={dropdownRef}>
        <div
          className="border border-gray-300 p-3 rounded cursor-pointer bg-white"
          onClick={() => setOpen((prev) => !prev)}
        >
          {selectedLabel}
        </div>

        {open && (
          <div className="absolute border border-gray-300 bg-white rounded mt-1 w-full max-h-64 overflow-y-auto shadow-xl z-10">
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

      {/* Tabla */}
      <div className="w-full overflow-x-auto border rounded">
        <table className="min-w-[1400px] w-full border-collapse">
          <thead>
            <tr>
              <th
                className="bg-blue-800 text-white border px-2 py-2 text-center text-[14px]"
                colSpan={12}
              >
                ESTRATEGIAS DE CONTINUIDAD
              </th>
            </tr>
            <tr className="bg-blue-700 text-white text-[12px]">
              <th className="border px-2 py-2 text-left">Nombre del Proceso Crítico</th>
              <th className="border px-2 py-2 text-left">Descripción del Proceso Crítico</th>
              <th className="border px-2 py-2 text-left">Tipo de estrategia</th>
              <th className="border px-2 py-2 text-left">Estrategias y soluciones de continuidad</th>
              <th className="border px-2 py-2 text-left">Asignación de recursos necesarios</th>
              <th className="border px-2 py-2 text-left">Asignación de responsabilidades</th>
              <th className="border px-2 py-2 text-left">Roles o funciones de los responsables</th>
              <th className="border px-2 py-2 text-left">Estructura de respuesta (alertamiento)</th>
              <th className="border px-2 py-2 text-left">Actividades a desarrollar en pruebas y simulacros</th>
              <th className="border px-2 py-2 text-left">Frecuencias de pruebas y simulacros</th>
              <th className="border px-2 py-2 text-left">Resultados de las pruebas y simulacros</th>
              <th className="border px-2 py-2 text-left">Monitoreo y evaluación del desempeño de las estrategias</th>
            </tr>
          </thead>

          <tbody className="text-[13px]">
            {grouped.length > 0 ? (
              grouped.map(([key, arr]) => {
                const [proceso, descripcion] = key.split("|||");
                const span = arr.length; // cuántas estrategias hay para este proceso
                return arr.map((r, idx) => (
                  <tr key={`${key}-${idx}`} className="odd:bg-white even:bg-gray-50">
                    {/* celdas combinadas */}
                    {idx === 0 && (
                      <td className="border px-2 py-2 align-top" rowSpan={span}>
                        {proceso}
                      </td>
                    )}
                    {idx === 0 && (
                      <td className="border px-2 py-2 align-top" rowSpan={span}>
                        {descripcion}
                      </td>
                    )}

                    {/* Tipo de estrategia (una fila por estrategia, en el orden definido) */}
                    <td className="border px-2 py-6 font-semibold">
                      {r.tipo}
                    </td>

                    {/* resto de columnas por estrategia */}
                    <td className="border px-2 py-2">{r.soluciones}</td>
                    <td className="border px-2 py-2">{r.recursos}</td>
                    <td className="border px-2 py-2">{r.responsabilidades}</td>
                    <td className="border px-2 py-2">{r.roles}</td>
                    <td className="border px-2 py-2">{r.estructura}</td>
                    <td className="border px-2 py-2">{r.actividades}</td>
                    <td className="border px-2 py-2">{r.frecuencias}</td>
                    <td className="border px-2 py-2">{r.resultados}</td>
                    <td className="border px-2 py-2">{r.monitoreo}</td>
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td colSpan={12} className="border px-4 py-6 text-center text-gray-500 italic bg-gray-50">
                  No hay estrategias registradas para este departamento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
