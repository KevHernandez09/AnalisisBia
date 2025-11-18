// app/plan/page.tsx
"use client";

import { useState } from "react";

export default function PlanPage() {
  const [pending, setPending] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setOkMsg(null);

    const fd = new FormData(e.currentTarget);

    const payload = {
      acciones: String(fd.get("acciones") ?? ""),
      marcoLegalidad: String(fd.get("marcoLegalidad") ?? ""),
      afectacionMarco: String(fd.get("afectacionMarco") ?? ""),
      coordinacion: String(fd.get("coordinacion") ?? ""),
      areaContacto: String(fd.get("areaContacto") ?? ""),
      requerimientos: String(fd.get("requerimientos") ?? ""),
    };

    console.log("Payload enviado:", payload);

    setTimeout(() => {
      setPending(false);
      setOkMsg("Plan registrado correctamente (por ahora solo en consola).");
      e.currentTarget.reset();
    }, 500);
  }

  const label = "block text-sm font-semibold text-[#0073a4] mb-1";
  const textarea =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm text-black bg-white outline-none focus:border-[#0073a4] focus:ring-1 focus:ring-[#0073a4]";
  const input =
    "w-full rounded border border-gray-300 px-3 py-2 text-sm text-black bg-white outline-none focus:border-[#0073a4] focus:ring-1 focus:ring-[#0073a4]";

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

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
      >
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
          <input
            name="areaContacto"
            className={input}
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
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-sm text-gray-700 hover:bg-gray-200"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 rounded bg-[#0073a4] text-sm font-semibold text-white hover:bg-[#005b8a] disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Guardar Plan"}
          </button>
        </div>
      </form>
    </section>
  );
}
