"use client";

import { useState } from "react";
import { z } from "zod";

/**
 * CATÁLOGOS
 */
const departamentos = [
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
];

// === SUBÁREAS ===
const subAreas = [
  { id: "gestion-pagos-tesoreria", label: "Área de gestión de pagos y tesorería", areaId: "14" },
  { id: "planilla-diputados", label: "Área de planilla de diputados", areaId: "14" },
  { id: "presupuesto", label: "Área de presupuesto", areaId: "14" },
  { id: "contabilidad", label: "Área de contabilidad", areaId: "14" },

  { id: "compras", label: "Área de compras", areaId: "16" },
  {
    id: "almacen-suministros-bienes-muebles",
    label: "Área de almacén de suministros y bienes muebles",
    areaId: "16",
  },
  { id: "gestion-control", label: "Área de gestión y control", areaId: "16" },

  { id: "administracion-salarios", label: "Área de administración de salarios", areaId: "17" },

  {
    id: "aprobacion-seguimiento-evaluacion-presupuesto",
    label: "Área de aprobación, seguimiento y evaluación del presupuesto",
    areaId: "11",
  },

  { id: "procesos-legislativos", label: "Área de procesos legislativos", areaId: "6" },
  { id: "actas-sonido-grabacion", label: "Área de actas, sonido y grabación", areaId: "6" },

  { id: "gestion-asuntos-plenario", label: "Área de gestión de asuntos del plenario", areaId: "2" },

  { id: "todo-departamento-sub", label: "Todo el departamento", areaId: "15" },

  { id: "contratacion-administrativa", label: "Área de contratación administrativa", areaId: "7" },
];

const tiposImpactoCat = [
  "Operativo",
  "Financiero",
  "Reputacional",
  "Regulatorio/Legal",
  "Tecnológico",
  "Seguridad de la Información",
  "Ambiental",
  "A la cuidadanía",
];

const prioridades = ["Alta", "Media", "Baja"];

/**
 * ZOD
 */
const BiaFormSchema = z.object({
  departamentoId: z.string().min(1),
  subAreaIds: z.array(z.string()).min(1),

  nombre: z.string().min(2),
  descripcion: z.string().min(5),

  entradas: z.string().optional().default(""),
  salidas: z.string().optional().default(""),
  partes: z.string().optional().default(""),
  sincronizacion: z.string().optional().default(""),
  rto: z.string().optional().default(""),
  mtpd: z.string().optional().default(""),
  rpo: z.string().optional().default(""),
  recursos: z.string().optional().default(""),
  requisitos: z.string().optional().default(""),
  descImpacto: z.string().optional().default(""),

  tiposImpacto: z.array(z.string()).min(1),
  prioridad: z.enum(["Alta", "Media", "Baja"]),
});

type BiaFormData = z.infer<typeof BiaFormSchema>;

export default function InsertarProcesoCriticoPage() {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setOkMsg(null);
    setErrors({});

    const fd = new FormData(e.currentTarget);

    const data: BiaFormData = {
      departamentoId: String(fd.get("departamentoId") ?? ""),
      subAreaIds: fd.getAll("subAreaIds").map(String),

      nombre: String(fd.get("nombre") ?? ""),
      descripcion: String(fd.get("descripcion") ?? ""),

      entradas: String(fd.get("entradas") ?? ""),
      salidas: String(fd.get("salidas") ?? ""),
      partes: String(fd.get("partes") ?? ""),
      sincronizacion: String(fd.get("sincronizacion") ?? ""),
      rto: String(fd.get("rto") ?? ""),
      mtpd: String(fd.get("mtpd") ?? ""),
      rpo: String(fd.get("rpo") ?? ""),
      recursos: String(fd.get("recursos") ?? ""),
      requisitos: String(fd.get("requisitos") ?? ""),
      descImpacto: String(fd.get("descImpacto") ?? ""),

      tiposImpacto: fd.getAll("tiposImpacto").map(String),
      prioridad: String(fd.get("prioridad") ?? "") as any,
    };

    const parsed = BiaFormSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        errs[i.path.join(".")] = i.message;
      });
      setErrors(errs);
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/proceso-critico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al guardar");
      }

      setOkMsg("Proceso crítico guardado correctamente.");
      e.currentTarget.reset();
    } catch (err: any) {
      setErrors({ _root: err.message ?? "Error inesperado" });
    } finally {
      setPending(false);
    }
  }

  const fieldClass = "w-full border rounded p-2 bg-white text-black";

  return (
    <section className="text-black max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Insertar Proceso Crítico</h1>

      {okMsg && (
        <div className="bg-green-50 border border-green-300 text-green-700 p-2 rounded mb-4">
          {okMsg}
        </div>
      )}
      {errors._root && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-2 rounded mb-4">
          {errors._root}
        </div>
      )}

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* DEPARTAMENTO */}
        <div>
          <label className="font-semibold">Departamento</label>
          <select name="departamentoId" defaultValue="" className={fieldClass}>
            <option value="" disabled>Seleccione...</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
          {errors.departamentoId && (
            <p className="text-sm text-red-600">{errors.departamentoId}</p>
          )}
        </div>

        {/* SUBÁREAS */}
        <fieldset className="md:col-span-2 border rounded p-3">
          <legend className="font-semibold">Subáreas</legend>
          {errors.subAreaIds && (
            <p className="text-sm text-red-600 mb-1">{errors.subAreaIds}</p>
          )}

          <div className="grid md:grid-cols-3 gap-2">
            {subAreas.map((s) => (
              <label key={s.id} className="flex gap-2 items-center">
                <input type="checkbox" name="subAreaIds" value={s.id} />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* CAMPOS GENERALES */}
        <div>
          <label className="font-semibold">Nombre</label>
          <input name="nombre" className={fieldClass} />
          {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <label className="font-semibold">Prioridad</label>
          <select name="prioridad" defaultValue="" className={fieldClass}>
            <option value="" disabled>Seleccione...</option>
            {prioridades.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.prioridad && <p className="text-sm text-red-600">{errors.prioridad}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="font-semibold">Descripción</label>
          <textarea name="descripcion" rows={3} className={fieldClass} />
          {errors.descripcion && <p className="text-sm text-red-600">{errors.descripcion}</p>}
        </div>

        {/* CAMPOS RESTANTES */}
        <div>
          <label className="font-semibold">Entradas</label>
          <textarea name="entradas" rows={2} className={fieldClass} />
        </div>
        <div>
          <label className="font-semibold">Salidas</label>
          <textarea name="salidas" rows={2} className={fieldClass} />
        </div>

        <div>
          <label className="font-semibold">Partes interesadas</label>
          <textarea name="partes" rows={2} className={fieldClass} />
        </div>
        <div>
          <label className="font-semibold">Sincronización</label>
          <textarea name="sincronizacion" rows={2} className={fieldClass} />
        </div>

        <div>
          <label className="font-semibold">RTO</label>
          <input name="rto" className={fieldClass} />
        </div>
        <div>
          <label className="font-semibold">MTPD</label>
          <input name="mtpd" className={fieldClass} />
        </div>
        <div>
          <label className="font-semibold">RPO</label>
          <input name="rpo" className={fieldClass} />
        </div>

        <div>
          <label className="font-semibold">Recursos</label>
          <textarea name="recursos" rows={2} className={fieldClass} />
        </div>
        <div>
          <label className="font-semibold">Requisitos legales</label>
          <textarea name="requisitos" rows={2} className={fieldClass} />
        </div>

        {/* TIPOS DE IMPACTO */}
        <fieldset className="md:col-span-2 border rounded p-3">
          <legend className="font-semibold">Tipos de impacto</legend>
          {errors.tiposImpacto && (
            <p className="text-sm text-red-600 mb-1">{errors.tiposImpacto}</p>
          )}
          <div className="grid md:grid-cols-3 gap-2">
            {tiposImpactoCat.map((t) => (
              <label key={t} className="flex gap-2 items-center">
                <input type="checkbox" name="tiposImpacto" value={t} />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="md:col-span-2">
          <label className="font-semibold">Descripción del impacto</label>
          <textarea name="descImpacto" rows={2} className={fieldClass} />
        </div>

        {/* ACCIONES */}
        <div className="md:col-span-2 flex gap-3 mt-2">
          <button
            type="submit"
            disabled={pending}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
          <button type="reset" className="border px-4 py-2 rounded">
            Limpiar
          </button>
        </div>

      </form>
    </section>
  );
}
