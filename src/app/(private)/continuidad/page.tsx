"use client";

import { useState, type FormEvent, useRef } from "react";
import { z } from "zod";

const areas = [
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

// Enum de IDs válidos para validar que no vengan valores "inventados".
const areaIdEnum = z.enum(areas.map((a) => a.id) as [string, ...string[]]);

const optionalText = z
  .string()
  .trim()
  .max(2000, "El texto es demasiado largo (máximo 2000 caracteres)")
  .optional()
  .default("");

const requiredSolution = z
  .string()
  .trim()
  .min(
    10,
    "Describa las estrategias y soluciones con más detalle (mínimo 10 caracteres)"
  )
  .max(4000, "El texto es demasiado largo (máximo 4000 caracteres)");

const Schema = z
  .object({
    areaIds: z
      .array(areaIdEnum)
      .min(1, "Seleccione al menos un área/gerencia"),

    nombreProceso: z
      .string()
      .trim()
      .min(
        5,
        "Ingrese un nombre de proceso crítico más descriptivo (mínimo 5 caracteres)"
      )
      .max(200, "El nombre del proceso es demasiado largo (máximo 200 caracteres)"),

    descripcionProceso: z
      .string()
      .trim()
      .min(
        15,
        "Describa el proceso crítico con más detalle (mínimo 15 caracteres)"
      )
      .max(
        2000,
        "La descripción del proceso es demasiado extensa (máximo 2000 caracteres)"
      ),

    // Prevención
    prev_soluciones: requiredSolution,
    prev_recursos: optionalText,
    prev_responsabilidades: optionalText,
    prev_roles: optionalText,
    prev_estructura: optionalText,
    prev_actividades: optionalText,
    prev_frecuencias: optionalText,
    prev_resultados: optionalText,
    prev_monitoreo: optionalText,

    // Contingencia
    cont_soluciones: requiredSolution,
    cont_recursos: optionalText,
    cont_responsabilidades: optionalText,
    cont_roles: optionalText,
    cont_estructura: optionalText,
    cont_actividades: optionalText,
    cont_frecuencias: optionalText,
    cont_resultados: optionalText,
    cont_monitoreo: optionalText,

    // Recuperación
    rec_soluciones: requiredSolution,
    rec_recursos: optionalText,
    rec_responsabilidades: optionalText,
    rec_roles: optionalText,
    rec_estructura: optionalText,
    rec_actividades: optionalText,
    rec_frecuencias: optionalText,
    rec_resultados: optionalText,
    rec_monitoreo: optionalText,

    // Comunicación / divulgación
    com_soluciones: requiredSolution,
    com_recursos: optionalText,
    com_responsabilidades: optionalText,
    com_roles: optionalText,
    com_estructura: optionalText,
    com_actividades: optionalText,
    com_frecuencias: optionalText,
    com_resultados: optionalText,
    com_monitoreo: optionalText,
  })
  .superRefine((data, ctx) => {
    // 1) Evitar IDs de áreas repetidos
    const unique = new Set(data.areaIds);
    if (unique.size !== data.areaIds.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No repita áreas/gerencias en la selección",
        path: ["areaIds"],
      });
    }

    // 2) Evitar que nombre y descripción sean iguales
    if (
      data.nombreProceso.trim().toLowerCase() ===
      data.descripcionProceso.trim().toLowerCase()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La descripción del proceso no debe ser idéntica al nombre",
        path: ["descripcionProceso"],
      });
    }

    // 3) Al menos un bloque con detalles adicionales
    const bloques = [
      [
        data.prev_recursos,
        data.prev_responsabilidades,
        data.prev_roles,
        data.prev_estructura,
        data.prev_actividades,
        data.prev_frecuencias,
        data.prev_resultados,
        data.prev_monitoreo,
      ],
      [
        data.cont_recursos,
        data.cont_responsabilidades,
        data.cont_roles,
        data.cont_estructura,
        data.cont_actividades,
        data.cont_frecuencias,
        data.cont_resultados,
        data.cont_monitoreo,
      ],
      [
        data.rec_recursos,
        data.rec_responsabilidades,
        data.rec_roles,
        data.rec_estructura,
        data.rec_actividades,
        data.rec_frecuencias,
        data.rec_resultados,
        data.rec_monitoreo,
      ],
      [
        data.com_recursos,
        data.com_responsabilidades,
        data.com_roles,
        data.com_estructura,
        data.com_actividades,
        data.com_frecuencias,
        data.com_resultados,
        data.com_monitoreo,
      ],
    ];

    const algunBloqueConDetalles = bloques.some((campos) =>
      campos.some((c) => (c ?? "").trim().length > 0)
    );

    if (!algunBloqueConDetalles) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Agregue al menos algún detalle adicional en prevención, contingencia, recuperación o comunicación (recursos, responsabilidades, actividades, etc.).",
        path: ["_detalleBloques"],
      });
    }
  });

type DTO = z.infer<typeof Schema>;

type EstrategiaPayload = {
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

type Payload = {
  areaIds: string[];
  nombreProceso: string;
  descripcionProceso: string;
  estrategias: EstrategiaPayload[];
};

export default function InsertarEstrategiaContinuidadPage() {
  const [pending, setPending] = useState(false); // solo para el POST real
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState<Payload | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setOkMsg(null);
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const dtoRaw: DTO = {
      areaIds: formData.getAll("areaIds").map(String),

      nombreProceso: String(formData.get("nombreProceso") ?? ""),
      descripcionProceso: String(formData.get("descripcionProceso") ?? ""),

      // Prevención
      prev_soluciones: String(formData.get("prev_soluciones") ?? ""),
      prev_recursos: String(formData.get("prev_recursos") ?? ""),
      prev_responsabilidades: String(
        formData.get("prev_responsabilidades") ?? ""
      ),
      prev_roles: String(formData.get("prev_roles") ?? ""),
      prev_estructura: String(formData.get("prev_estructura") ?? ""),
      prev_actividades: String(formData.get("prev_actividades") ?? ""),
      prev_frecuencias: String(formData.get("prev_frecuencias") ?? ""),
      prev_resultados: String(formData.get("prev_resultados") ?? ""),
      prev_monitoreo: String(formData.get("prev_monitoreo") ?? ""),

      // Contingencia
      cont_soluciones: String(formData.get("cont_soluciones") ?? ""),
      cont_recursos: String(formData.get("cont_recursos") ?? ""),
      cont_responsabilidades: String(
        formData.get("cont_responsabilidades") ?? ""
      ),
      cont_roles: String(formData.get("cont_roles") ?? ""),
      cont_estructura: String(formData.get("cont_estructura") ?? ""),
      cont_actividades: String(formData.get("cont_actividades") ?? ""),
      cont_frecuencias: String(formData.get("cont_frecuencias") ?? ""),
      cont_resultados: String(formData.get("cont_resultados") ?? ""),
      cont_monitoreo: String(formData.get("cont_monitoreo") ?? ""),

      // Recuperación
      rec_soluciones: String(formData.get("rec_soluciones") ?? ""),
      rec_recursos: String(formData.get("rec_recursos") ?? ""),
      rec_responsabilidades: String(
        formData.get("rec_responsabilidades") ?? ""
      ),
      rec_roles: String(formData.get("rec_roles") ?? ""),
      rec_estructura: String(formData.get("rec_estructura") ?? ""),
      rec_actividades: String(formData.get("rec_actividades") ?? ""),
      rec_frecuencias: String(formData.get("rec_frecuencias") ?? ""),
      rec_resultados: String(formData.get("rec_resultados") ?? ""),
      rec_monitoreo: String(formData.get("rec_monitoreo") ?? ""),

      // Comunicación / divulgación
      com_soluciones: String(formData.get("com_soluciones") ?? ""),
      com_recursos: String(formData.get("com_recursos") ?? ""),
      com_responsabilidades: String(
        formData.get("com_responsabilidades") ?? ""
      ),
      com_roles: String(formData.get("com_roles") ?? ""),
      com_estructura: String(formData.get("com_estructura") ?? ""),
      com_actividades: String(formData.get("com_actividades") ?? ""),
      com_frecuencias: String(formData.get("com_frecuencias") ?? ""),
      com_resultados: String(formData.get("com_resultados") ?? ""),
      com_monitoreo: String(formData.get("com_monitoreo") ?? ""),
    };

    const parsed = Schema.safeParse(dtoRaw);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const pathKey = issue.path.join(".") || "_root";
        if (!fieldErrors[pathKey]) {
          fieldErrors[pathKey] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    const d = parsed.data;

    const payload: Payload = {
      areaIds: d.areaIds,
      nombreProceso: d.nombreProceso.trim(),
      descripcionProceso: d.descripcionProceso.trim(),
      estrategias: [
        {
          tipo: "Estrategias de prevención",
          soluciones: d.prev_soluciones,
          recursos: d.prev_recursos,
          responsabilidades: d.prev_responsabilidades,
          roles: d.prev_roles,
          estructura: d.prev_estructura,
          actividades: d.prev_actividades,
          frecuencias: d.prev_frecuencias,
          resultados: d.prev_resultados,
          monitoreo: d.prev_monitoreo,
        },
        {
          tipo: "Estrategias de contingencia",
          soluciones: d.cont_soluciones,
          recursos: d.cont_recursos,
          responsabilidades: d.cont_responsabilidades,
          roles: d.cont_roles,
          estructura: d.cont_estructura,
          actividades: d.cont_actividades,
          frecuencias: d.cont_frecuencias,
          resultados: d.cont_resultados,
          monitoreo: d.cont_monitoreo,
        },
        {
          tipo: "Estrategias de recuperación",
          soluciones: d.rec_soluciones,
          recursos: d.rec_recursos,
          responsabilidades: d.rec_responsabilidades,
          roles: d.rec_roles,
          estructura: d.rec_estructura,
          actividades: d.rec_actividades,
          frecuencias: d.rec_frecuencias,
          resultados: d.rec_resultados,
          monitoreo: d.rec_monitoreo,
        },
        {
          tipo: "Estrategias de comunicación/divulgación",
          soluciones: d.com_soluciones,
          recursos: d.com_recursos,
          responsabilidades: d.com_responsabilidades,
          roles: d.com_roles,
          estructura: d.com_estructura,
          actividades: d.com_actividades,
          frecuencias: d.com_frecuencias,
          resultados: d.com_resultados,
          monitoreo: d.com_monitoreo,
        },
      ],
    };

    // Guardamos el payload y abrimos el modal de confirmación
    setConfirmPayload(payload);
    setShowConfirm(true);
    formRef.current = form;
  }

  async function handleConfirmSubmit() {
    if (!confirmPayload) return;

    setPending(true);
    setErrors({});
    setOkMsg(null);

    try {
      const res = await fetch("/api/estrategias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmPayload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al guardar las estrategias");
      }

      setOkMsg("Estrategias de continuidad guardadas correctamente.");
      if (formRef.current) {
        formRef.current.reset();
      }
      setConfirmPayload(null);
      setShowConfirm(false);
    } catch (err: any) {
      setErrors({
        _root: err?.message ?? "Error inesperado al guardar las estrategias",
      });
    } finally {
      setPending(false);
    }
  }

  function handleCancelConfirm() {
    setShowConfirm(false);
    setConfirmPayload(null);
  }

  const baseField =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-800 " +
    "shadow-sm outline-none transition";

  const label = "block text-sm font-semibold text-[#0073a4] mb-1";

  const fieldClass = (name: string) =>
    baseField +
    " " +
    (errors[name]
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-300"
      : "border-gray-300 focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30");

  const requiredMark = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <>
      <section className="text-black px-6 pt-6">
        <header className="relative mb-6 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 px-5 py-5 shadow-sm backdrop-blur md:px-6">
          {/* Accent + glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/0 to-sky-100/40" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500 opacity-90" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative space-y-2">
            {/* Chip superior */}
            <span className="inline-flex items-center rounded-full border border-cyan-200/70 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-800">
              Formulario de Estrategias de Continuidad
            </span>

            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Estrategias de Continuidad
            </h1>

            {/* Descripción */}
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              Registre, para un proceso crítico, las estrategias de prevención,
              contingencia, recuperación y comunicación/divulgación.
            </p>

            {/* Divider sutil */}
            <div className="pt-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
            </div>
          </div>
        </header>


        <div className="bg-white/90 border border-gray-200 rounded-2xl shadow-md p-5 md:p-7">
          {okMsg && (
            <div className="mb-4 rounded bg-green-50 border border-green-300 text-green-700 px-3 py-2 text-sm">
              {okMsg}
            </div>
          )}
          {errors._root && (
            <div className="mb-4 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2 text-sm">
              {errors._root}
            </div>
          )}
          {errors._detalleBloques && (
            <div className="mb-4 rounded bg-yellow-50 border border-yellow-300 text-yellow-800 px-3 py-2 text-sm">
              {errors._detalleBloques}
            </div>
          )}

          <form
            id="form-continuidad"
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Áreas (multiselección) */}
            <fieldset className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-slate-50/60">
              <legend className="px-2 text-sm font-semibold text-[#0073a4]">
                Áreas / Departamentos (puede elegir varias) {requiredMark}
              </legend>
              {errors.areaIds && (
                <p className="text-xs text-red-600 mb-2">{errors.areaIds}</p>
              )}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {areas.map((a) => (
                  <label
                    key={a.id}
                    className="
                      flex items-center gap-2 text-sm bg-white border border-gray-200
                      rounded-lg px-3 py-2 hover:border-[#0073a4]/70 cursor-pointer
                      transition
                    "
                  >
                    <input
                      type="checkbox"
                      name="areaIds"
                      value={a.id}
                      className="h-4 w-4"
                    />
                    <span className="text-gray-800">{a.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Proceso crítico */}
            <div>
              <label className={label}>
                Nombre del Proceso Crítico {requiredMark}
              </label>
              <input
                name="nombreProceso"
                className={fieldClass("nombreProceso")}
                placeholder="Ej.: Gestión de nómina, Atención al ciudadano..."
                required
                aria-invalid={!!errors.nombreProceso}
                aria-describedby={
                  errors.nombreProceso ? "error-nombreProceso" : undefined
                }
              />
              {errors.nombreProceso && (
                <p id="error-nombreProceso" className="text-xs text-red-600 mt-1">
                  {errors.nombreProceso}
                </p>
              )}
            </div>
            <div>
              <label className={label}>
                Descripción del Proceso Crítico {requiredMark}
              </label>
              <textarea
                name="descripcionProceso"
                rows={3}
                className={fieldClass("descripcionProceso") + " resize-y"}
                required
                aria-invalid={!!errors.descripcionProceso}
                aria-describedby={
                  errors.descripcionProceso ? "error-descripcionProceso" : undefined
                }
              />
              {errors.descripcionProceso && (
                <p
                  id="error-descripcionProceso"
                  className="text-xs text-red-600 mt-1"
                >
                  {errors.descripcionProceso}
                </p>
              )}
            </div>

            {/* ================== ESTRATEGIA DE PREVENCIÓN ================== */}
            <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Estrategias de prevención
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Medidas para evitar o reducir la probabilidad de interrupciones del proceso.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={label}>
                1. Estrategias y soluciones de continuidad {requiredMark}
              </label>
              <textarea
                name="prev_soluciones"
                rows={3}
                className={fieldClass("prev_soluciones") + " resize-y"}
                required
                aria-invalid={!!errors.prev_soluciones}
                aria-describedby={
                  errors.prev_soluciones ? "error-prev_soluciones" : undefined
                }
              />
              {errors.prev_soluciones && (
                <p
                  id="error-prev_soluciones"
                  className="text-xs text-red-600 mt-1"
                >
                  {errors.prev_soluciones}
                </p>
              )}
            </div>

            <div>
              <label className={label}>2. Asignación de recursos necesarios</label>
              <textarea
                name="prev_recursos"
                rows={2}
                className={fieldClass("prev_recursos") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>3. Asignación de responsabilidades</label>
              <textarea
                name="prev_responsabilidades"
                rows={2}
                className={fieldClass("prev_responsabilidades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                4. Roles o funciones de los responsables
              </label>
              <textarea
                name="prev_roles"
                rows={2}
                className={fieldClass("prev_roles") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>5. Estructura de respuesta (alertamiento)</label>
              <textarea
                name="prev_estructura"
                rows={2}
                className={fieldClass("prev_estructura") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                6. Actividades a desarrollar en pruebas y simulacros
              </label>
              <textarea
                name="prev_actividades"
                rows={2}
                className={fieldClass("prev_actividades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                7. Frecuencias de pruebas y simulacros
              </label>
              <input
                name="prev_frecuencias"
                className={fieldClass("prev_frecuencias")}
                placeholder="Mensual / Trimestral / Semestral / Anual..."
              />
            </div>

            <div>
              <label className={label}>
                8. Resultados de las pruebas y simulacros
              </label>
              <textarea
                name="prev_resultados"
                rows={2}
                className={fieldClass("prev_resultados") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                9. Monitoreo y evaluación del desempeño
              </label>
              <textarea
                name="prev_monitoreo"
                rows={2}
                className={fieldClass("prev_monitoreo") + " resize-y"}
              />
            </div>

            {/* ================== ESTRATEGIA DE CONTINGENCIA ================== */}
            <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Estrategias de contingencia
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Acciones previstas para responder ante incidentes o eventos disruptivos.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={label}>
                1. Estrategias y soluciones de continuidad {requiredMark}
              </label>
              <textarea
                name="cont_soluciones"
                rows={3}
                className={fieldClass("cont_soluciones") + " resize-y"}
                required
                aria-invalid={!!errors.cont_soluciones}
                aria-describedby={
                  errors.cont_soluciones ? "error-cont_soluciones" : undefined
                }
              />
              {errors.cont_soluciones && (
                <p
                  id="error-cont_soluciones"
                  className="text-xs text-red-600 mt-1"
                >
                  {errors.cont_soluciones}
                </p>
              )}
            </div>

            <div>
              <label className={label}>2. Asignación de recursos necesarios</label>
              <textarea
                name="cont_recursos"
                rows={2}
                className={fieldClass("cont_recursos") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>3. Asignación de responsabilidades</label>
              <textarea
                name="cont_responsabilidades"
                rows={2}
                className={fieldClass("cont_responsabilidades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                4. Roles o funciones de los responsables
              </label>
              <textarea
                name="cont_roles"
                rows={2}
                className={fieldClass("cont_roles") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>5. Estructura de respuesta (alertamiento)</label>
              <textarea
                name="cont_estructura"
                rows={2}
                className={fieldClass("cont_estructura") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                6. Actividades a desarrollar en pruebas y simulacros
              </label>
              <textarea
                name="cont_actividades"
                rows={2}
                className={fieldClass("cont_actividades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                7. Frecuencias de pruebas y simulacros
              </label>
              <input
                name="cont_frecuencias"
                className={fieldClass("cont_frecuencias")}
                placeholder="Mensual / Trimestral / Semestral / Anual..."
              />
            </div>

            <div>
              <label className={label}>
                8. Resultados de las pruebas y simulacros
              </label>
              <textarea
                name="cont_resultados"
                rows={2}
                className={fieldClass("cont_resultados") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                9. Monitoreo y evaluación del desempeño
              </label>
              <textarea
                name="cont_monitoreo"
                rows={2}
                className={fieldClass("cont_monitoreo") + " resize-y"}
              />
            </div>

            {/* ================== ESTRATEGIA DE RECUPERACIÓN ================== */}
            <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Estrategias de recuperación
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Medidas para restablecer el servicio o proceso a niveles aceptables.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={label}>
                1. Estrategias y soluciones de continuidad {requiredMark}
              </label>
              <textarea
                name="rec_soluciones"
                rows={3}
                className={fieldClass("rec_soluciones") + " resize-y"}
                required
                aria-invalid={!!errors.rec_soluciones}
                aria-describedby={
                  errors.rec_soluciones ? "error-rec_soluciones" : undefined
                }
              />
              {errors.rec_soluciones && (
                <p id="error-rec_soluciones" className="text-xs text-red-600 mt-1">
                  {errors.rec_soluciones}
                </p>
              )}
            </div>

            <div>
              <label className={label}>2. Asignación de recursos necesarios</label>
              <textarea
                name="rec_recursos"
                rows={2}
                className={fieldClass("rec_recursos") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>3. Asignación de responsabilidades</label>
              <textarea
                name="rec_responsabilidades"
                rows={2}
                className={fieldClass("rec_responsabilidades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                4. Roles o funciones de los responsables
              </label>
              <textarea
                name="rec_roles"
                rows={2}
                className={fieldClass("rec_roles") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>5. Estructura de respuesta (alertamiento)</label>
              <textarea
                name="rec_estructura"
                rows={2}
                className={fieldClass("rec_estructura") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                6. Actividades a desarrollar en pruebas y simulacros
              </label>
              <textarea
                name="rec_actividades"
                rows={2}
                className={fieldClass("rec_actividades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                7. Frecuencias de pruebas y simulacros
              </label>
              <input
                name="rec_frecuencias"
                className={fieldClass("rec_frecuencias")}
                placeholder="Mensual / Trimestral / Semestral / Anual..."
              />
            </div>

            <div>
              <label className={label}>
                8. Resultados de las pruebas y simulacros
              </label>
              <textarea
                name="rec_resultados"
                rows={2}
                className={fieldClass("rec_resultados") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                9. Monitoreo y evaluación del desempeño
              </label>
              <textarea
                name="rec_monitoreo"
                rows={2}
                className={fieldClass("rec_monitoreo") + " resize-y"}
              />
            </div>

            {/* ========== ESTRATEGIAS DE COMUNICACIÓN / DIVULGACIÓN ========== */}
            <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Estrategias de comunicación / divulgación
              </h2>
              <p className="text-xs text-gray-500 mb-3">
                Defina cómo se informará y sensibilizará a las partes interesadas.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={label}>
                1. Estrategias y soluciones de continuidad {requiredMark}
              </label>
              <textarea
                name="com_soluciones"
                rows={3}
                className={fieldClass("com_soluciones") + " resize-y"}
                required
                aria-invalid={!!errors.com_soluciones}
                aria-describedby={
                  errors.com_soluciones ? "error-com_soluciones" : undefined
                }
              />
              {errors.com_soluciones && (
                <p
                  id="error-com_soluciones"
                  className="text-xs text-red-600 mt-1"
                >
                  {errors.com_soluciones}
                </p>
              )}
            </div>

            <div>
              <label className={label}>2. Asignación de recursos necesarios</label>
              <textarea
                name="com_recursos"
                rows={2}
                className={fieldClass("com_recursos") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>3. Asignación de responsabilidades</label>
              <textarea
                name="com_responsabilidades"
                rows={2}
                className={fieldClass("com_responsabilidades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                4. Roles o funciones de los responsables
              </label>
              <textarea
                name="com_roles"
                rows={2}
                className={fieldClass("com_roles") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>5. Estructura de respuesta (alertamiento)</label>
              <textarea
                name="com_estructura"
                rows={2}
                className={fieldClass("com_estructura") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                6. Actividades a desarrollar en pruebas y simulacros
              </label>
              <textarea
                name="com_actividades"
                rows={2}
                className={fieldClass("com_actividades") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                7. Frecuencias de pruebas y simulacros
              </label>
              <input
                name="com_frecuencias"
                className={fieldClass("com_frecuencias")}
                placeholder="Mensual / Trimestral / Semestral / Anual..."
              />
            </div>

            <div>
              <label className={label}>
                8. Resultados de las pruebas y simulacros
              </label>
              <textarea
                name="com_resultados"
                rows={2}
                className={fieldClass("com_resultados") + " resize-y"}
              />
            </div>

            <div>
              <label className={label}>
                9. Monitoreo y evaluación del desempeño
              </label>
              <textarea
                name="com_monitoreo"
                rows={2}
                className={fieldClass("com_monitoreo") + " resize-y"}
              />
            </div>

            {/* Acciones */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-4 justify-end">
              <button
                type="reset"
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition"
                disabled={pending}
              >
                Limpiar
              </button>
              <button
                type="submit"
                disabled={pending}
                className="
                  px-5 py-2.5 rounded-lg text-sm font-semibold text-white
                  bg-emerald-600 hover:bg-emerald-500
                  disabled:opacity-60 disabled:cursor-not-allowed
                  shadow-md shadow-emerald-500/25 transition
                "
                aria-busy={pending}
              >
                {pending ? "Guardando..." : "Guardar estrategias de continuidad"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MODAL DE CONFIRMACIÓN */}
      {showConfirm && confirmPayload && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          {/* Overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={handleCancelConfirm}
          />

          {/* Caja de diálogo */}
          <div className="relative z-50 w-full max-w-md mx-4 rounded-2xl bg-white border border-gray-200 shadow-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Confirmar registro de estrategias de continuidad
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              ¿Desea registrar las estrategias de continuidad para el siguiente
              proceso crítico?
            </p>

            <div className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 mb-4">
              <p className="text-xs font-semibold text-gray-800">
                Proceso crítico:
              </p>
              <p className="text-xs text-gray-900">
                {confirmPayload.nombreProceso}
              </p>
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-3">
                {confirmPayload.descripcionProceso}
              </p>
            </div>

            <p className="text-[11px] text-gray-600 mb-4">
              Una vez guardadas, las estrategias podrán ser consultadas desde los
              módulos de visualización y continuidad.
            </p>

            <div className="flex justify-end gap-2 text-sm">
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                disabled={pending}
              >
                Revisar de nuevo
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={pending}
                className="
                  px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium
                  hover:bg-emerald-500 shadow-md shadow-emerald-500/30
                  disabled:opacity-60 disabled:cursor-not-allowed transition
                "
              >
                {pending ? "Guardando..." : "Sí, guardar estrategias"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
