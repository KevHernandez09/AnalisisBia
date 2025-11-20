// app/api/plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();
// 👇 usamos any para esquivar el cliente desactualizado de Prisma en tiempo de compilación
const prismaAny = prisma as any;

const PlanAccionSchema = z.object({
  planId: z.string().min(1, "El plan es obligatorio"),
  acciones: z.string().min(1, "Las acciones son obligatorias"),
  marcoLegalidad: z.string().optional().default(""),
  afectacionMarco: z.string().optional().default(""),
  coordinacion: z.string().optional().default(""),
  areaContacto: z.string().optional().default(""),
  requerimientos: z.string().optional().default(""),
});

// GET /api/plan?planId=1
export async function GET(req: NextRequest) {
  try {
    const planId = req.nextUrl.searchParams.get("planId") ?? undefined;

    const acciones = await prismaAny.planAccion.findMany({
      where: planId ? { planId } : undefined,
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    });

    const items = acciones.map((a: any) => ({
      id: a.id,
      acciones: a.acciones,
      marcoLegalidad: a.marcoLegalidad,
      afectacionMarco: a.afectacionMarco,
      coordinacion: a.coordinacion,
      areaContacto: a.areaContacto,
      requerimientos: a.requerimientos,
      createdAt: a.createdAt.toISOString(),
      planId: a.planId,
      planNombre: a.plan?.nombre ?? "",
    }));

    return NextResponse.json({ items });
  } catch (e: any) {
    console.error("GET /api/plan error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Error al consultar los planes" },
      { status: 500 },
    );
  }
}

// POST /api/plan
export async function POST(req: NextRequest) {
  try {
    const json = await req.json();

    const parsed = PlanAccionSchema.safeParse(json);
    if (!parsed.success) {
      const msg = parsed.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = parsed.data;

    // Validar que el plan exista
    const plan = await prismaAny.plan.findUnique({
      where: { id: data.planId },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "El plan especificado no existe" },
        { status: 400 },
      );
    }

    const created = await prismaAny.planAccion.create({
      data: {
        planId: data.planId,
        acciones: data.acciones,
        marcoLegalidad: data.marcoLegalidad,
        afectacionMarco: data.afectacionMarco,
        coordinacion: data.coordinacion,
        areaContacto: data.areaContacto,
        requerimientos: data.requerimientos,
      },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/plan error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Error al registrar el plan" },
      { status: 500 },
    );
  }
}
