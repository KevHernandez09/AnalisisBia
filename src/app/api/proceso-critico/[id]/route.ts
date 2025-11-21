import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateSchema = z.object({
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  entradas: z.string().optional(),
  salidas: z.string().optional(),
  partes: z.string().optional(),
  sincronizacion: z.string().optional(),
  rto: z.string().optional(),
  mtpd: z.string().optional(),
  rpo: z.string().optional(),
  recursos: z.string().optional(),
  requisitos: z.string().optional(),
  descImpacto: z.string().optional(),
  prioridad: z.enum(["Alta", "Media", "Baja"]).optional(),
});

/**
 * PATCH /api/proceso-critico/:id
 */
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 👇 IMPORTANTE: params es un Promise en App Router
    const { id } = await context.params;

    const json = await req.json();
    const parsed = UpdateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.format() },
        { status: 400 },
      );
    }

    await prisma.procesoCritico.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("PATCH /api/proceso-critico/[id]:", err);

    if (err?.code === "P2025") {
      return NextResponse.json(
        { error: "Proceso crítico no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar proceso crítico" },
      { status: 500 },
    );
  }
}
