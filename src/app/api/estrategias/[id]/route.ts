// app/api/estrategias/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateSchema = z.object({
  tipo: z.string().optional(),
  soluciones: z.string().optional(),
  recursos: z.string().optional(),
  responsabilidades: z.string().optional(),
  roles: z.string().optional(),
  estructura: z.string().optional(),
  actividades: z.string().optional(),
  frecuencias: z.string().optional(),
  resultados: z.string().optional(),
  monitoreo: z.string().optional(),
  // Si algún día quieres editar nombreProceso/descripcionProceso desde acá:
  // nombreProceso: z.string().optional(),
  // descripcionProceso: z.string().optional(),
});

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const json = await req.json();
    const parsed = UpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.format() },
        { status: 400 },
      );
    }

    await prisma.estrategia.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/estrategias/[id]:", err);

    if (err?.code === "P2025") {
      return NextResponse.json(
        { error: "Estrategia no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar la estrategia" },
      { status: 500 },
    );
  }
}
