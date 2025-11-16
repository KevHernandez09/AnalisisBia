"use client";

import { useState } from "react";
import { z } from "zod";

const areas = [
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
  { id: "13", label: "Departamento de __________________" },
  { id: "14", label: "Departamento de Financiero" },
  { id: "15", label: "Departamento de Servicios Generales" },
  { id: "16", label: "Departamento de Proveeduría" },
  { id: "17", label: "Departamento de Recursos Humanos" },
  { id: "18", label: "Departamento de Servicios de Salud" },
  { id: "19", label: "Comité Institucional de Emergencias" },
];

const EstrategiaSchema = z.object({
  soluciones: z.string().min(3, "Describa las estrategias y soluciones"),
  recursos: z.string().optional().default(""),
  responsabilidades: z.string().optional().default(""),
  roles: z.string().optional().default(""),
  estructura: z.string().optional().default(""),
  actividades: z.string().optional().default(""),
  frecuencias: z.string().optional().default(""),
  resultados: z.string().optional().default(""),
  monitoreo: z.string().optional().default(""),
});

// Zod: proceso + 4 bloques de estrategia
const Schema = z.object({
  areaIds: z.array(z.string()).min(1, "Seleccione al menos un área/gerencia"),
  nombreProceso: z.string().min(2, "Ingrese el nombre del proceso crítico"),
  descripcionProceso: z.string().min(5, "Describa el proceso crítico"),

  // Prevención
  prev_soluciones: z.string().min(3, "Describa las estrategias y soluciones"),
  prev_recursos: z.string().optional().default(""),
  prev_responsabilidades: z.string().optional().default(""),
  prev_roles: z.string().optional().default(""),
  prev_estructura: z.string().optional().default(""),
  prev_actividades: z.string().optional().default(""),
  prev_frecuencias: z.string().optional().default(""),
  prev_resultados: z.string().optional().default(""),
  prev_monitoreo: z.string().optional().default(""),

  // Contingencia
  cont_soluciones: z.string().min(3, "Describa las estrategias y soluciones"),
  cont_recursos: z.string().optional().default(""),
  cont_responsabilidades: z.string().optional().default(""),
  cont_roles: z.string().optional().default(""),
  cont_estructura: z.string().optional().default(""),
  cont_actividades: z.string().optional().default(""),
  cont_frecuencias: z.string().optional().default(""),
  cont_resultados: z.string().optional().default(""),
  cont_monitoreo: z.string().optional().default(""),

  // Recuperación
  rec_soluciones: z.string().min(3, "Describa las estrategias y soluciones"),
  rec_recursos: z.string().optional().default(""),
  rec_responsabilidades: z.string().optional().default(""),
  rec_roles: z.string().optional().default(""),
  rec_estructura: z.string().optional().default(""),
  rec_actividades: z.string().optional().default(""),
  rec_frecuencias: z.string().optional().default(""),
  rec_resultados: z.string().optional().default(""),
  rec_monitoreo: z.string().optional().default(""),

  // Comunicación / divulgación
  com_soluciones: z.string().min(3, "Describa las estrategias y soluciones"),
  com_recursos: z.string().optional().default(""),
  com_responsabilidades: z.string().optional().default(""),
  com_roles: z.string().optional().default(""),
  com_estructura: z.string().optional().default(""),
  com_actividades: z.string().optional().default(""),
  com_frecuencias: z.string().optional().default(""),
  com_resultados: z.string().optional().default(""),
  com_monitoreo: z.string().optional().default(""),
});

type DTO = z.infer<typeof Schema>;

export default function InsertarEstrategiaContinuidadPage() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setOkMsg(null);
    setErrors({});
    setPending(true);

    const dto: DTO = {
      areaIds: formData.getAll("areaIds").map(String),
      nombreProceso: String(formData.get("nombreProceso") ?? ""),
      descripcionProceso: String(formData.get("descripcionProceso") ?? ""),

      // Prevención
      prev_soluciones: String(formData.get("prev_soluciones") ?? ""),
      prev_recursos: String(formData.get("prev_recursos") ?? ""),
      prev_responsabilidades: String(formData.get("prev_responsabilidades") ?? ""),
      prev_roles: String(formData.get("prev_roles") ?? ""),
      prev_estructura: String(formData.get("prev_estructura") ?? ""),
      prev_actividades: String(formData.get("prev_actividades") ?? ""),
      prev_frecuencias: String(formData.get("prev_frecuencias") ?? ""),
      prev_resultados: String(formData.get("prev_resultados") ?? ""),
      prev_monitoreo: String(formData.get("prev_monitoreo") ?? ""),

      // Contingencia
      cont_soluciones: String(formData.get("cont_soluciones") ?? ""),
      cont_recursos: String(formData.get("cont_recursos") ?? ""),
      cont_responsabilidades: String(formData.get("cont_responsabilidades") ?? ""),
      cont_roles: String(formData.get("cont_roles") ?? ""),
      cont_estructura: String(formData.get("cont_estructura") ?? ""),
      cont_actividades: String(formData.get("cont_actividades") ?? ""),
      cont_frecuencias: String(formData.get("cont_frecuencias") ?? ""),
      cont_resultados: String(formData.get("cont_resultados") ?? ""),
      cont_monitoreo: String(formData.get("cont_monitoreo") ?? ""),

      // Recuperación
      rec_soluciones: String(formData.get("rec_soluciones") ?? ""),
      rec_recursos: String(formData.get("rec_recursos") ?? ""),
      rec_responsabilidades: String(formData.get("rec_responsabilidades") ?? ""),
      rec_roles: String(formData.get("rec_roles") ?? ""),
      rec_estructura: String(formData.get("rec_estructura") ?? ""),
      rec_actividades: String(formData.get("rec_actividades") ?? ""),
      rec_frecuencias: String(formData.get("rec_frecuencias") ?? ""),
      rec_resultados: String(formData.get("rec_resultados") ?? ""),
      rec_monitoreo: String(formData.get("rec_monitoreo") ?? ""),

      // Comunicación / divulgación
      com_soluciones: String(formData.get("com_soluciones") ?? ""),
      com_recursos: String(formData.get("com_recursos") ?? ""),
      com_responsabilidades: String(formData.get("com_responsabilidades") ?? ""),
      com_roles: String(formData.get("com_roles") ?? ""),
      com_estructura: String(formData.get("com_estructura") ?? ""),
      com_actividades: String(formData.get("com_actividades") ?? ""),
      com_frecuencias: String(formData.get("com_frecuencias") ?? ""),
      com_resultados: String(formData.get("com_resultados") ?? ""),
      com_monitoreo: String(formData.get("com_monitoreo") ?? ""),
    };

    const parsed = Schema.safeParse(dto);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path.join(".")] = i.message;
      });
      setErrors(fieldErrors);
      setPending(false);
      return;
    }

    const d = parsed.data;

    // Construimos el payload: 4 estrategias en un solo envío
    const payload = {
      areaIds: d.areaIds,
      nombreProceso: d.nombreProceso,
      descripcionProceso: d.descripcionProceso,
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

    try {
      const res = await fetch("/api/estrategias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al guardar");
      }
      setOkMsg("Estrategias de continuidad guardadas correctamente.");
      (document.getElementById("form-continuidad") as HTMLFormElement)?.reset();
    } catch (e: any) {
      setErrors({ _root: e.message ?? "Error inesperado" });
    } finally {
      setPending(false);
    }
  }

  const field =
    "w-full border rounded p-2 bg-white text-black placeholder-gray-400";
  const label = "block text-sm font-semibold mb-1";

  return (
    <section className="text-black max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Estrategias de Continuidad</h1>

      {okMsg && (
        <div className="mb-4 rounded bg-green-50 border border-green-300 text-green-700 px-3 py-2">
          {okMsg}
        </div>
      )}
      {errors._root && (
        <div className="mb-4 rounded bg-red-50 border border-red-300 text-red-700 px-3 py-2">
          {errors._root}
        </div>
      )}

      <form
        id="form-continuidad"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        action={onSubmit}
      >
        {/* Áreas (multiselección) */}
        <fieldset className="md:col-span-2 border rounded p-3 bg-[white]">
          <legend className="text-sm font-semibold text-[#0073a4]">
            Áreas/Departamentos (puede elegir varias)
          </legend>
          {errors.areaIds && (
            <p className="text-sm text-red-600 mb-1">{errors.areaIds}</p>
          )}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {areas.map((a) => (
              <label key={a.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="areaIds"
                  value={a.id}
                  className="h-4 w-4"
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Proceso crítico */}
        <div className="text-[#0073a4]">
          <label className={label}>Nombre del Proceso Crítico</label>
          <input
            name="nombreProceso"
            className={field}
            placeholder="Ej.: Nómina, Ventas, Mesa de ayuda..."
          />
          {errors.nombreProceso && (
            <p className="text-sm text-red-600 mt-1">
              {errors.nombreProceso}
            </p>
          )}
        </div>
        <div className="text-[#0073a4]">
          <label className={label}>Descripción del Proceso Crítico</label>
          <textarea name="descripcionProceso" rows={3} className={field} />
          {errors.descripcionProceso && (
            <p className="text-sm text-red-600 mt-1">
              {errors.descripcionProceso}
            </p>
          )}
        </div>

        {/* ================== ESTRATEGIA DE PREVENCIÓN ================== */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-2 mb-2">
            Estrategias de prevención
          </h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>
            1. Estrategias y soluciones de continuidad *
          </label>
          <textarea name="prev_soluciones" rows={3} className={field} />
          {errors.prev_soluciones && (
            <p className="text-sm text-red-600 mt-1">
              {errors.prev_soluciones}
            </p>
          )}
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>2. Asignación de recursos necesarios</label>
          <textarea name="prev_recursos" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>3. Asignación de responsabilidades</label>
          <textarea name="prev_responsabilidades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            4. Roles o funciones de los responsables
          </label>
          <textarea name="prev_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="prev_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            6. Actividades a desarrollar en pruebas y simulacros
          </label>
          <textarea name="prev_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            7. Frecuencias de pruebas y simulacros
          </label>
          <input
            name="prev_frecuencias"
            className={field}
            placeholder="Mensual / Trimestral / Semestral / Anual..."
          />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            8. Resultados de las pruebas y simulacros
          </label>
          <textarea name="prev_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            9. Monitoreo y evaluación del desempeño
          </label>
          <textarea name="prev_monitoreo" rows={2} className={field} />
        </div>

        {/* ================== ESTRATEGIA DE CONTINGENCIA ================== */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-4 mb-2">
            Estrategias de contingencia
          </h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>
            1. Estrategias y soluciones de continuidad *
          </label>
          <textarea name="cont_soluciones" rows={3} className={field} />
          {errors.cont_soluciones && (
            <p className="text-sm text-red-600 mt-1">
              {errors.cont_soluciones}
            </p>
          )}
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>2. Asignación de recursos necesarios</label>
          <textarea name="cont_recursos" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>3. Asignación de responsabilidades</label>
          <textarea name="cont_responsabilidades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            4. Roles o funciones de los responsables
          </label>
          <textarea name="cont_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="cont_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            6. Actividades a desarrollar en pruebas y simulacros
          </label>
          <textarea name="cont_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            7. Frecuencias de pruebas y simulacros
          </label>
          <input
            name="cont_frecuencias"
            className={field}
            placeholder="Mensual / Trimestral / Semestral / Anual..."
          />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            8. Resultados de las pruebas y simulacros
          </label>
          <textarea name="cont_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            9. Monitoreo y evaluación del desempeño
          </label>
          <textarea name="cont_monitoreo" rows={2} className={field} />
        </div>

        {/* ================== ESTRATEGIA DE RECUPERACIÓN ================== */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-4 mb-2">
            Estrategias de recuperación
          </h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>
            1. Estrategias y soluciones de continuidad *
          </label>
          <textarea name="rec_soluciones" rows={3} className={field} />
          {errors.rec_soluciones && (
            <p className="text-sm text-red-600 mt-1">
              {errors.rec_soluciones}
            </p>
          )}
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>2. Asignación de recursos necesarios</label>
          <textarea name="rec_recursos" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>3. Asignación de responsabilidades</label>
          <textarea name="rec_responsabilidades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            4. Roles o funciones de los responsables
          </label>
          <textarea name="rec_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="rec_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            6. Actividades a desarrollar en pruebas y simulacros
          </label>
          <textarea name="rec_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            7. Frecuencias de pruebas y simulacros
          </label>
          <input
            name="rec_frecuencias"
            className={field}
            placeholder="Mensual / Trimestral / Semestral / Anual..."
          />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            8. Resultados de las pruebas y simulacros
          </label>
          <textarea name="rec_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            9. Monitoreo y evaluación del desempeño
          </label>
          <textarea name="rec_monitoreo" rows={2} className={field} />
        </div>

        {/* ========== ESTRATEGIAS DE COMUNICACIÓN / DIVULGACIÓN ========== */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-4 mb-2">
            Estrategias de comunicación/divulgación
          </h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>
            1. Estrategias y soluciones de continuidad *
          </label>
          <textarea name="com_soluciones" rows={3} className={field} />
          {errors.com_soluciones && (
            <p className="text-sm text-red-600 mt-1">
              {errors.com_soluciones}
            </p>
          )}
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>2. Asignación de recursos necesarios</label>
          <textarea name="com_recursos" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>3. Asignación de responsabilidades</label>
          <textarea name="com_responsabilidades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            4. Roles o funciones de los responsables
          </label>
          <textarea name="com_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="com_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            6. Actividades a desarrollar en pruebas y simulacros
          </label>
          <textarea name="com_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            7. Frecuencias de pruebas y simulacros
          </label>
          <input
            name="com_frecuencias"
            className={field}
            placeholder="Mensual / Trimestral / Semestral / Anual..."
          />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            8. Resultados de las pruebas y simulacros
          </label>
          <textarea name="com_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>
            9. Monitoreo y evaluación del desempeño
          </label>
          <textarea name="com_monitoreo" rows={2} className={field} />
        </div>

        {/* Acciones */}
        <div className="md:col-span-2 flex gap-3 mt-4">
          <button
            type="submit"
            disabled={pending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            aria-busy={pending}
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="reset"
            className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}
