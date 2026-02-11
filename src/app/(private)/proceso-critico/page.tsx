"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
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

// === SUBÁREAS ===
const subAreas = [
  {
    id: "accesibilidad-discapacidad",
    label:
      "Área de accesibilidad para las personas con discapacidad en la Asamblea Legislativa",
    areaId: "4",
  },
  { id: "sol-parl", label: "Área de Soluciones Parlamentarias", areaId: "5" },
  { id: "infra", label: "Área de Infraestructura", areaId: "5" },
  {
    id: "sol-apo-admin",
    label: "Área de Soluciones de Apoyo Administrativo",
    areaId: "5",
  },
  {
    id: "actas-sonido-grabacion",
    label: "Área de Actas, Sonido y Grabación",
    areaId: "6",
  },
  {
    id: "administracion-salarios",
    label: "Área de Administración de Salarios",
    areaId: "17",
  },
  {
    id: "almacen-suministros-bienes-muebles",
    label: "Área de Almacén de Suministros y Bienes muebles",
    areaId: "16",
  },
  {
    id: "aprobacion-seguimiento-evaluacion-presupuesto",
    label: "Área de Aprobación, Seguimiento y Evaluación del Presupuesto",
    areaId: "11",
  },
  { id: "compras", label: "Área de Compras", areaId: "16" },
  { id: "contabilidad", label: "Área de Contabilidad", areaId: "14" },
  {
    id: "continuidad-servicio",
    label: "Área de Gestión Administrativa de Continuidad del Servicio",
    areaId: "13",
  },
  {
    id: "contratacion-administrativa",
    label: "Área de Contratación Administrativa",
    areaId: "7",
  },
  {
    id: "departamento-directorio",
    label: "Todo el departamento de Secretaria del Directorio",
    areaId: "20",
  },
  {
    id: "dep-pren-inst",
    label: "Todo el departamento de Prensa Institucional",
    areaId: "8",
  },
  {
    id: "dep-ser-salud",
    label: "Todo el departamento de Servicios de Salud",
    areaId: "18",
  },
  {
    id: "dep-ser-tec",
    label: "Todo el departamento de Servicios Técnicos",
    areaId: "22",
  },
  {
    id: "ger-admin-gestion",
    label: "Gerencia Administrativa/Área de Gestión Administrativa",
    areaId: "13",
  },
  {
    id: "gestion-admin",
    label: "Área de Gestión Administrativa",
    areaId: "18",
  },
  {
    id: "seg-op-int",
    label: "Área de Seguridad Operativa-Monitoreo-Inteligencia",
    areaId: "9",
  },
  {
    id: "infor-ciber",
    label: "Área de Seguridad de la Información-Ciberseguridad",
    areaId: "9",
  },
  { id: "ujieres", label: "Área de Ujieres", areaId: "15" },
  { id: "transporte", label: "Área de Transporte", areaId: "15" },
  { id: "mantenimiento", label: "Área de Mantenimiento", areaId: "15" },
  {
    id: "gestion-asuntos-plenario",
    label: "Área de Gestión de Asuntos del Plenario",
    areaId: "20",
  },
  {
    id: "gestion-control",
    label: "Área de Gestión y Control",
    areaId: "16",
  },
  {
    id: "gestion-pagos-tesoreria",
    label: "Área de Gestión de Pagos y Tesorería",
    areaId: "14",
  },
  {
    id: "planilla-diputados",
    label: "Área de Planilla de Diputados",
    areaId: "14",
  },
  { id: "presupuesto", label: "Área de Presupuesto", areaId: "14" },
  {
    id: "procesos-legislativos",
    label: "Área de Procesos Legislativos",
    areaId: "6",
  },
  { id: "protocolo-area", label: "Área de protocolo", areaId: "6" },
  { id: "salud-proceso", label: "Proceso de Salud Ocupacional", areaId: "13" },
  { id: "todo-departamento-sub", label: "Todo el departamento", areaId: "1" },
];

const tiposImpactoCat = [
  "A la ciudadanía",
  "Ambiental",
  "Clima Organizacional",
  "Continuidad Operativa",
  "Documental y Normativo",
  "Económico",
  "Financiero",
  "Físicos",
  "Gestión del Riesgo",
  "Imagen institucional",
  "Impacto a la confidencialidad, integridad y disponibilidad de la información.",
  "Ocupacional",
  "Operativo",
  "Organizacional",
  "Planificación",
  "Psicológico",
  "Regulatorio/Legal",
  "Reputacional",
  "Rompimiento del orden constitucional",
  "Salud y Seguridad de los Trabajadores",
  "Seguridad de la Información",
  "Seguridad/integridad física",
  "Seguridad y Salud de las personas",
  "Seguridad y Salud Ocupacional",
  "Tecnológico",
];

const prioridades = ["Alta", "Media", "Baja"];

/**
 * ZOD
 * (idéntico al original)
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

  // Modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState<BiaFormData | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Estado para el combobox de departamento
  const [departamentoId, setDepartamentoId] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement | null>(null);

  const filteredDepartamentos = departamentos.filter((d) =>
    d.label.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const selectedDepartamentoLabel =
    departamentos.find((d) => d.id === departamentoId)?.label ||
    "Seleccione un departamento…";

  // Cerrar dropdown de departamento al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        deptDropdownRef.current &&
        !deptDropdownRef.current.contains(e.target as Node)
      ) {
        setDeptOpen(false);
        setDeptSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setOkMsg(null);
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);

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
        const key = i.path.join(".") || "_root";
        if (!errs[key]) {
          errs[key] = i.message;
        }
      });
      setErrors(errs);
      return;
    }

    // Datos limpios para mostrar en el modal
    const cleaned: BiaFormData = {
      ...parsed.data,
      nombre: parsed.data.nombre.trim(),
      descripcion: parsed.data.descripcion.trim(),
      descImpacto: parsed.data.descImpacto?.trim() ?? "",
    };

    setConfirmPayload(cleaned);
    setShowConfirm(true);
    formRef.current = form;
  }

  async function handleConfirmSubmit() {
    if (!confirmPayload) return;

    setPending(true);
    setErrors({});
    setOkMsg(null);

    try {
      const res = await fetch("/api/proceso-critico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmPayload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al guardar");
      }

      setOkMsg("Proceso crítico guardado correctamente.");

      if (formRef.current) {
        formRef.current.reset();
      }
      setDepartamentoId("");
      setConfirmPayload(null);
      setShowConfirm(false);
    } catch (err: any) {
      setErrors({ _root: err?.message ?? "Error inesperado" });
    } finally {
      setPending(false);
    }
  }

  function handleCancelConfirm() {
    if (pending) return;
    setShowConfirm(false);
    setConfirmPayload(null);
  }

  const fieldClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 " +
    "shadow-sm outline-none focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30 transition";

  const labelClass = "block text-sm font-semibold text-[#0073a4] mb-1";

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
              Formulario de Procesos Críticos
            </span>

            {/* Título */}
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              Insertar Proceso Crítico
            </h1>

            {/* Descripción */}
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              Registre la información clave del proceso crítico, sus recursos y los
              impactos asociados para el análisis BIA institucional.
            </p>

            {/* Divider */}
            <div className="pt-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
            </div>
          </div>
        </header>


        <div className="bg-white/90 border border-gray-200 rounded-2xl shadow-md p-5 md:p-7">
          {okMsg && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-3 py-2 rounded mb-4 text-sm">
              {okMsg}
            </div>
          )}
          {errors._root && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {errors._root}
            </div>
          )}

          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* === SECCIÓN: INFORMACIÓN GENERAL === */}
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Información general
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DEPARTAMENTO - Combobox Moderno */}
                <div className="relative" ref={deptDropdownRef}>
                  <label className={labelClass}>Departamento</label>

                  {/* input hidden para FormData */}
                  <input
                    type="hidden"
                    name="departamentoId"
                    value={departamentoId}
                  />

                  <button
                    type="button"
                    onClick={() => setDeptOpen((prev) => !prev)}
                    className="
                      w-full flex items-center justify-between
                      px-4 py-2.5 rounded-xl bg-white border border-gray-300 shadow-sm
                      hover:border-[#0073a4] focus:border-[#0073a4]
                      focus:ring-2 focus:ring-[#0073a4]/30 transition-all
                      text-left text-sm font-medium text-gray-700
                    "
                  >
                    <span>{selectedDepartamentoLabel}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${deptOpen ? "rotate-180" : "rotate-0"
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

                  {deptOpen && (
                    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden z-50">
                      <div className="p-2 border-b border-gray-200 bg-gray-50">
                        <input
                          type="text"
                          placeholder="Buscar departamento..."
                          className="
                            w-full px-3 py-2 rounded-lg bg-white border border-gray-300
                            text-gray-700 text-sm outline-none
                            focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30
                            transition-all
                          "
                          value={deptSearch}
                          onChange={(e) => setDeptSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="max-h-56 overflow-y-auto">
                        {filteredDepartamentos.length > 0 ? (
                          filteredDepartamentos.map((d) => (
                            <div
                              key={d.id}
                              className={`
                                px-4 py-2.5 cursor-pointer text-sm transition-all
                                ${departamentoId === d.id
                                  ? "bg-[#0073a4]/10 text-[#0073a4] font-semibold"
                                  : "hover:bg-gray-100"
                                }
                              `}
                              onClick={() => {
                                setDepartamentoId(d.id);
                                setDeptOpen(false);
                                setDeptSearch("");
                              }}
                            >
                              {d.label}
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

                  {errors.departamentoId && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.departamentoId}
                    </p>
                  )}
                </div>

                {/* PRIORIDAD */}
                <div>
                  <label className={labelClass}>Prioridad</label>
                  <select name="prioridad" defaultValue="" className={fieldClass}>
                    <option value="" disabled>
                      Seleccione...
                    </option>
                    {prioridades.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.prioridad && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.prioridad}
                    </p>
                  )}
                </div>

                {/* NOMBRE */}
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Nombre del Proceso Crítico
                  </label>
                  <input name="nombre" className={fieldClass} />
                  {errors.nombre && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.nombre}
                    </p>
                  )}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    Descripción del Proceso Crítico
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    className={fieldClass + " resize-y"}
                  />
                  {errors.descripcion && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.descripcion}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* === SECCIÓN: SUBÁREAS === */}
            <fieldset className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-slate-50/60">
              <legend className="px-2 text-sm font-semibold text-[#0073a4]">
                Subáreas vinculadas
              </legend>
              {errors.subAreaIds && (
                <p className="text-xs text-red-600 mb-2">
                  {errors.subAreaIds}
                </p>
              )}

              <div className="grid md:grid-cols-3 gap-2 mt-2">
                {subAreas.map((s) => (
                  <label
                    key={s.id}
                    className="
                      flex gap-2 items-center text-sm bg-white border border-gray-200
                      rounded-lg px-3 py-2 hover:border-[#0073a4]/70 cursor-pointer
                      transition
                    "
                  >
                    <input type="checkbox" name="subAreaIds" value={s.id} />
                    <span className="text-gray-800">{s.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* === SECCIÓN: DETALLE DEL PROCESO === */}
            <div className="md:col-span-2">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Detalle del proceso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Entradas</label>
                  <textarea
                    name="entradas"
                    rows={2}
                    className={fieldClass + " resize-y"}
                  />
                </div>
                <div>
                  <label className={labelClass}>Salidas</label>
                  <textarea
                    name="salidas"
                    rows={2}
                    className={fieldClass + " resize-y"}
                  />
                </div>

                <div>
                  <label className={labelClass}>Partes interesadas</label>
                  <textarea
                    name="partes"
                    rows={2}
                    className={fieldClass + " resize-y"}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Sincronización con otros procesos
                  </label>
                  <textarea
                    name="sincronizacion"
                    rows={2}
                    className={fieldClass + " resize-y"}
                  />
                </div>

                <div>
                  <label className={labelClass}>RTO</label>
                  <input name="rto" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>MTPD</label>
                  <input name="mtpd" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>RPO</label>
                  <input name="rpo" className={fieldClass} />
                </div>

                <div>
                  <label className={labelClass}>Recursos necesarios</label>
                  <textarea
                    name="recursos"
                    rows={2}
                    className={fieldClass + " resize-y"}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Requisitos legales y normativos
                  </label>
                  <textarea
                    name="requisitos"
                    rows={2}
                    className={fieldClass + " resize-y"}
                  />
                </div>
              </div>
            </div>

            {/* === SECCIÓN: IMPACTOS === */}
            <fieldset className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-slate-50/60">
              <legend className="px-2 text-sm font-semibold text-[#0073a4]">
                Impactos asociados
              </legend>

              {errors.tiposImpacto && (
                <p className="text-xs text-red-600 mb-2">
                  {errors.tiposImpacto}
                </p>
              )}

              <div className="grid md:grid-cols-3 gap-2 mb-3">
                {tiposImpactoCat.map((t) => (
                  <label
                    key={t}
                    className="
                      flex gap-2 items-center text-sm bg-white border border-gray-200
                      rounded-lg px-3 py-2 hover:border-[#0073a4]/70 cursor-pointer
                      transition
                    "
                  >
                    <input type="checkbox" name="tiposImpacto" value={t} />
                    <span className="text-gray-800">{t}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className={labelClass}>Descripción del impacto</label>
                <textarea
                  name="descImpacto"
                  rows={3}
                  className={fieldClass + " resize-y"}
                />
              </div>
            </fieldset>

            {/* ACCIONES */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2 justify-end">
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
              >
                {pending ? "Guardando..." : "Guardar proceso crítico"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* MODAL DE CONFIRMACIÓN (igual estilo que el de estrategias) */}
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
              Confirmar registro de proceso crítico
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              ¿Desea registrar el siguiente proceso crítico en el sistema BIA
              institucional?
            </p>

            <div className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 mb-3">
              <p className="text-xs font-semibold text-gray-800">
                Departamento:
              </p>
              <p className="text-xs text-gray-900">
                {
                  departamentos.find(
                    (d) => d.id === confirmPayload.departamentoId
                  )?.label
                }
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 mb-4">
              <p className="text-xs font-semibold text-gray-800">
                Proceso crítico:
              </p>
              <p className="text-xs text-gray-900">
                {confirmPayload.nombre}
              </p>
              <p className="text-[11px] text-gray-600 mt-1 line-clamp-3">
                {confirmPayload.descripcion}
              </p>
            </div>

            <p className="text-[11px] text-gray-600 mb-4">
              Una vez guardado, el proceso podrá ser consultado en los módulos
              de análisis BIA y continuidad. Esta acción no elimina registros
              previos.
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
                {pending ? "Guardando..." : "Sí, guardar proceso"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
