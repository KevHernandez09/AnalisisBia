// app/plan/page.tsx
"use client";

import {
  useState,
  type FormEvent,
  useEffect,
  useRef,
} from "react";

const planes = [
  { id: "1", label: "Comisión Institucional de Presupuesto" },
  { id: "2", label: "CISAAL" },

  
];

export default function PlanPage() {
  const [pending, setPending] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Estado del combo
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [searchPlan, setSearchPlan] = useState("");
  const [planError, setPlanError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel =
    planes.find((p) => p.id === selected)?.label || "Seleccione un plan…";

  const filteredPlanes = planes.filter((p) =>
    p.label.toLowerCase().includes(searchPlan.toLowerCase()),
  );

  // Cerrar combobox al hacer click fuera
  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(ev.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; // guardar referencia ANTES de cualquier await

    setApiError(null);
    setOkMsg(null);
    setPlanError(null);
    setPending(true);

    if (!selected) {
      setPlanError("Debe seleccionar un plan.");
      setPending(false);
      return;
    }

    const fd = new FormData(form);

    const payload = {
      planId: selected,
      acciones: String(fd.get("acciones") ?? "").trim(),
      marcoLegalidad: String(fd.get("marcoLegalidad") ?? "").trim(),
      afectacionMarco: String(fd.get("afectacionMarco") ?? "").trim(),
      coordinacion: String(fd.get("coordinacion") ?? "").trim(),
      areaContacto: String(fd.get("areaContacto") ?? "").trim(),
      requerimientos: String(fd.get("requerimientos") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Error al guardar el plan");
      }

      setOkMsg("Plan registrado correctamente.");
      form.reset();
      setSelected("");
      setSearchPlan("");
    } catch (err: any) {
      setApiError(err?.message ?? "Error inesperado al guardar el plan");
    } finally {
      setPending(false);
    }
  }

  const label = "block text-sm font-semibold text-[#0073a4] mb-1";
  const textarea =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black bg-white " +
    "outline-none focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30 shadow-sm transition";
  const input =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black bg-white " +
    "outline-none focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30 shadow-sm transition";

  return (
    <section className="px-6 pt-6 pb-10 text-black max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Insertar Plan de Acción</h1>
      <p className="text-sm text-gray-600 mb-6">
        Complete la siguiente información para registrar un nuevo plan de Acción.
      </p>

      {okMsg && (
        <div className="mb-4 rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
          {okMsg}
        </div>
      )}
      {apiError && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        noValidate
      >
        {/* Combobox Moderno - Plan asociado */}
        <div>
          <label className={label}>
            Plan al que se asocia esta información{" "}
            <span className="text-red-500">*</span>
          </label>

          {/* hidden por si en el futuro querés leer planId directo desde FormData */}
          <input type="hidden" name="planId" value={selected} />

          <div className="relative max-w-xl mb-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((p) => !p)}
              className={`
                w-full flex items-center justify-between
                px-4 py-3 rounded-xl bg-white border
                ${planError ? "border-red-400" : "border-gray-300"}
                shadow-sm
                hover:border-[#0073a4] focus:border-[#0073a4]
                focus:ring-2 focus:ring-[#0073a4]/30 transition-all
                text-left text-[15px] font-medium
                ${selected ? "text-gray-800" : "text-gray-500"}
              `}
            >
              <span>{selectedLabel}</span>

              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  open ? "rotate-180" : "rotate-0"
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
                  absolute mt-2 w-full bg-white border border-gray-200
                  rounded-xl shadow-xl z-10 max-h-64 overflow-hidden
                "
              >
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Buscar plan..."
                    value={searchPlan}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchPlan(e.target.value)}
                    className="
                      w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-300
                      text-gray-700 text-sm transition-all outline-none
                      focus:border-[#0073a4] focus:ring-2 focus:ring-[#0073a4]/30
                    "
                  />
                </div>

                <div className="max-h-56 overflow-y-auto">
                  {filteredPlanes.length > 0 ? (
                    filteredPlanes.map((op) => (
                      <div
                        key={op.id}
                        className={`
                          px-4 py-2.5 cursor-pointer text-sm transition-all
                          ${
                            selected === op.id
                              ? "bg-[#0073a4]/10 text-[#0073a4] font-semibold"
                              : "hover:bg-gray-100"
                          }
                        `}
                        onClick={() => {
                          setSelected(op.id);
                          setOpen(false);
                          setSearchPlan("");
                          setPlanError(null);
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

          {planError && ( 
            <p className="text-xs text-red-600 mt-1">{planError}</p>
          )}
        </div>

        {/* Acciones por ejecutar */}
        <div>
          <label className={label}>Acciones por ejecutar</label>
          <textarea
            name="acciones"
            rows={5}
            required
            className={textarea}
            placeholder="Describa las acciones específicas que se deben ejecutar…"
          />
        </div>

        {/* Marco de legalidad */}
        <div>
          <label className={label}>Marco de legalidad</label>
          <textarea
            name="marcoLegalidad"
            rows={4}
            className={textarea}
            placeholder="Indique leyes, reglamentos, normativas internas aplicables…"
          />
        </div>

        {/* Afectación del marco de legalidad */}
        <div>
          <label className={label}>Afectación del Marco de Legalidad</label>
          <textarea
            name="afectacionMarco"
            rows={4}
            className={textarea}
            placeholder="Explique cómo el evento afecta el marco de legalidad…"
          />
        </div>

        {/* Coordinación */}
        <div>
          <label className={label}>Coordinación interna y/o externa</label>
          <textarea
            name="coordinacion"
            rows={4}
            className={textarea}
            placeholder="Indique instancias internas/externas, comités, enlaces, etc.…"
          />
        </div>

        {/* Área de contacto */}
        <div>
          <label className={label}>Área de contacto</label>
          <textarea
            name="areaContacto"
            className={textarea}
            placeholder="Ej.: Departamento de Protocolo, CIE, RRHH…"
          />
        </div>

        {/* Requerimientos */}
        <div>
          <label className={label}>Requerimientos para la intervención</label>
          <textarea
            name="requerimientos"
            rows={4}
            className={textarea}
            placeholder="Recursos, insumos, personal, logística, presupuesto…"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="reset"
            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
            disabled={pending}
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 rounded-lg bg-[#0073a4] text-sm font-semibold text-white hover:bg-[#005b8a] disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar Plan"}
          </button>
        </div>
      </form>
    </section>
  );
}
