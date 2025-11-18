// app/plan/lista/page.tsx
"use client";

import { useEffect, useState } from "react";

type PlanRow = {
  id: string;
  acciones: string;
  marcoLegalidad: string;
  afectacionMarco: string;
  coordinacion: string;
  areaContacto: string;
  requerimientos: string;
  createdAt?: string;
};

export default function PlanListaPage() {
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch("/api/plan", { cache: "no-store" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.error || "Error al consultar los planes");
        }

        const j = (await res.json()) as { items: PlanRow[] } | PlanRow[];

        // Soporta ambos formatos: { items: [...] } o [...]
        const data = Array.isArray(j) ? j : j.items ?? [];
        setRows(data);
      } catch (e: any) {
        setErr(e?.message ?? "Error inesperado");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <section className="px-6 pt-6 pb-10 text-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Planes de Intervención</h1>
        <p className="text-sm text-gray-600 mb-4">
          Visualice los planes registrados con sus acciones, marco de legalidad,
          coordinación y requerimientos.
        </p>

        {err && (
          <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {err}
          </div>
        )}
        {loading && (
          <p className="mb-3 text-sm text-gray-600">Cargando planes…</p>
        )}

        <div className="bg-[#0073a4] border rounded shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1200px] border-collapse">
              <thead>
                <tr className="text-white text-[13px]">
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    #
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Acciones por ejecutar
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Marco de Legalidad
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Afectación del Marco de Legalidad
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Coordinación interna y/o externa
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Área de Contacto
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Requerimientos para la intervención
                  </th>
                  <th className="border px-2 py-2 text-left bg-[#005d82]">
                    Fecha de registro
                  </th>
                </tr>
              </thead>

              <tbody className="text-[13px] bg-white">
                {rows.length > 0 ? (
                  rows.map((row, idx) => (
                    <tr
                      key={row.id ?? idx}
                      className="odd:bg-white even:bg-gray-50 align-top"
                    >
                      <td className="border px-2 py-2">{idx + 1}</td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.acciones}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.marcoLegalidad}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.afectacionMarco}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.coordinacion}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.areaContacto}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.requerimientos}
                      </td>
                      <td className="border px-2 py-2 whitespace-pre-line">
                        {row.createdAt
                          ? new Date(row.createdAt).toLocaleString("es-CR")
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="border px-4 py-6 text-center text-gray-100 bg-[#0073a4]"
                    >
                      {loading
                        ? "Cargando…"
                        : "No hay planes de intervención registrados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
