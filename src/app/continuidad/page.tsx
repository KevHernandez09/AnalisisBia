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

// Zod: nombre + descripción + estrategia de prevención (9 campos)
const Schema = z.object({
  areaIds: z.array(z.string()).min(1, "Seleccione al menos un área/gerencia"),
  nombreProceso: z.string().min(2, "Ingrese el nombre del proceso crítico"),
  descripcionProceso: z.string().min(5, "Describa el proceso crítico"),

  // Estrategia de prevención
  prev_soluciones: z.string().min(3, "Describa las estrategias y soluciones"),
  prev_recursos: z.string().optional().default(""),
  prev_responsabilidades: z.string().optional().default(""),
  prev_roles: z.string().optional().default(""),
  prev_estructura: z.string().optional().default(""),
  prev_actividades: z.string().optional().default(""),
  prev_frecuencias: z.string().optional().default(""),
  prev_resultados: z.string().optional().default(""),
  prev_monitoreo: z.string().optional().default(""),
});
type DTO = z.infer<typeof Schema>;

export default function InsertarEstrategiaPrevencionPage() {
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
      prev_soluciones: String(formData.get("prev_soluciones") ?? ""),
      prev_recursos: String(formData.get("prev_recursos") ?? ""),
      prev_responsabilidades: String(formData.get("prev_responsabilidades") ?? ""),
      prev_roles: String(formData.get("prev_roles") ?? ""),
      prev_estructura: String(formData.get("prev_estructura") ?? ""),
      prev_actividades: String(formData.get("prev_actividades") ?? ""),
      prev_frecuencias: String(formData.get("prev_frecuencias") ?? ""),
      prev_resultados: String(formData.get("prev_resultados") ?? ""),
      prev_monitoreo: String(formData.get("prev_monitoreo") ?? ""),
    };

    const parsed = Schema.safeParse(dto);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach(i => (fieldErrors[i.path.join(".")] = i.message));
      setErrors(fieldErrors);
      setPending(false);
      return;
    }

    // Construimos el payload para tu backend
    const payload = {
      areaIds: parsed.data.areaIds,
      nombreProceso: parsed.data.nombreProceso,
      descripcionProceso: parsed.data.descripcionProceso,
      tipo: "Estrategias de prevención",
      soluciones: parsed.data.prev_soluciones,
      recursos: parsed.data.prev_recursos,
      responsabilidades: parsed.data.prev_responsabilidades,
      roles: parsed.data.prev_roles,
      estructura: parsed.data.prev_estructura,
      actividades: parsed.data.prev_actividades,
      frecuencias: parsed.data.prev_frecuencias,
      resultados: parsed.data.prev_resultados,
      monitoreo: parsed.data.prev_monitoreo,
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
      setOkMsg("Estrategia de prevención guardada correctamente.");
      (document.getElementById("form-prevencion") as HTMLFormElement)?.reset();
    } catch (e: any) {
      setErrors({ _root: e.message ?? "Error inesperado" });
    } finally {
      setPending(false);
    }
  }

  const field = "w-full border rounded p-2 bg-white text-black placeholder-gray-400";
  const label = "block text-sm font-semibold mb-1";

  return (
    <section className="text-black max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Añadir Estrategia de Prevención</h1>

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

      <form id="form-prevencion" className="grid grid-cols-1 md:grid-cols-2 gap-4" action={onSubmit}>
        {/* Áreas (multiselección) */}
        <fieldset className="md:col-span-2 border rounded p-3 bg-[white]">
          <legend className="text-sm font-semibold text-[#0073a4] ">Áreas/Departamentos (puede elegir varias)</legend>
          {errors.areaIds && <p className="text-sm text-red-600 mb-1">{errors.areaIds}</p>}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {areas.map((a) => (
              <label key={a.id} className="flex items-center gap-2">
                <input type="checkbox" name="areaIds" value={a.id} className="h-4 w-4" />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Proceso crítico */}
        <div className="text-[#0073a4]">
          <label className={label}>Nombre del Proceso Crítico</label>
          <input name="nombreProceso" className={field} placeholder="Ej.: Nómina, Ventas, Mesa de ayuda..." />
          {errors.nombreProceso && <p className="text-sm text-red-600 mt-1">{errors.nombreProceso}</p>}
        </div>
        <div className="text-[#0073a4]">
          <label className={label}>Descripción del Proceso Crítico</label>
          <textarea name="descripcionProceso" rows={3} className={field} />
          {errors.descripcionProceso && <p className="text-sm text-red-600 mt-1">{errors.descripcionProceso}</p>}
        </div>

        {/* Estrategia de prevención (9 campos) */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-2 mb-2">Estrategia de prevención</h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>1. Estrategias y soluciones de continuidad *</label>
          <textarea name="prev_soluciones" rows={3} className={field} />
          {errors.prev_soluciones && <p className="text-sm text-red-600 mt-1">{errors.prev_soluciones}</p>}
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
          <label className={label}>4. Roles o funciones de los responsables</label>
          <textarea name="prev_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="prev_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>6. Actividades a desarrollar en pruebas y simulacros</label>
          <textarea name="prev_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>7. Frecuencias de pruebas y simulacros</label>
          <input name="prev_frecuencias" className={field} placeholder="Mensual / Trimestral / Semestral / Anual..." />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>8. Resultados de las pruebas y simulacros</label>
          <textarea name="prev_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>9. Monitoreo y evaluación del desempeño</label>
          <textarea name="prev_monitoreo" rows={2} className={field} />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-2 mb-2">Estrategia de contingencia</h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>1. Estrategias y soluciones de continuidad *</label>
          <textarea name="prev_soluciones" rows={3} className={field} />
          {errors.prev_soluciones && <p className="text-sm text-red-600 mt-1">{errors.prev_soluciones}</p>}
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
          <label className={label}>4. Roles o funciones de los responsables</label>
          <textarea name="prev_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="prev_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>6. Actividades a desarrollar en pruebas y simulacros</label>
          <textarea name="prev_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>7. Frecuencias de pruebas y simulacros</label>
          <input name="prev_frecuencias" className={field} placeholder="Mensual / Trimestral / Semestral / Anual..." />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>8. Resultados de las pruebas y simulacros</label>
          <textarea name="prev_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>9. Monitoreo y evaluación del desempeño</label>
          <textarea name="prev_monitoreo" rows={2} className={field} />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-2 mb-2">Estrategia de recuperación</h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>1. Estrategias y soluciones de continuidad *</label>
          <textarea name="prev_soluciones" rows={3} className={field} />
          {errors.prev_soluciones && <p className="text-sm text-red-600 mt-1">{errors.prev_soluciones}</p>}
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
          <label className={label}>4. Roles o funciones de los responsables</label>
          <textarea name="prev_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="prev_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>6. Actividades a desarrollar en pruebas y simulacros</label>
          <textarea name="prev_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>7. Frecuencias de pruebas y simulacros</label>
          <input name="prev_frecuencias" className={field} placeholder="Mensual / Trimestral / Semestral / Anual..." />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>8. Resultados de las pruebas y simulacros</label>
          <textarea name="prev_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>9. Monitoreo y evaluación del desempeño</label>
          <textarea name="prev_monitoreo" rows={2} className={field} />
        </div>
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mt-2 mb-2">Estrategias de comunicación/divulgación</h2>
        </div>

        <div className="md:col-span-2 text-[#0073a4]">
          <label className={label}>1. Estrategias y soluciones de continuidad *</label>
          <textarea name="prev_soluciones" rows={3} className={field} />
          {errors.prev_soluciones && <p className="text-sm text-red-600 mt-1">{errors.prev_soluciones}</p>}
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
          <label className={label}>4. Roles o funciones de los responsables</label>
          <textarea name="prev_roles" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>5. Estructura de respuesta (alertamiento)</label>
          <textarea name="prev_estructura" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>6. Actividades a desarrollar en pruebas y simulacros</label>
          <textarea name="prev_actividades" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>7. Frecuencias de pruebas y simulacros</label>
          <input name="prev_frecuencias" className={field} placeholder="Mensual / Trimestral / Semestral / Anual..." />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>8. Resultados de las pruebas y simulacros</label>
          <textarea name="prev_resultados" rows={2} className={field} />
        </div>

        <div className="text-[#0073a4]">
          <label className={label}>9. Monitoreo y evaluación del desempeño</label>
          <textarea name="prev_monitoreo" rows={2} className={field} />
        </div>


        {/* Acciones */}
        <div className="md:col-span-2 flex gap-3 mt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60"
            aria-busy={pending}
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
          <button type="reset" className="bg-yellow-600 text-white px-4 py-2 rounded disabled:opacity-50">
            Limpiar
          </button>
        </div>
      </form>
    </section>
  );
}
