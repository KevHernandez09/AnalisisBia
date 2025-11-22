// app/api/estrategias/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { requireApiSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Para el POST: estructura de cada estrategia
const EstrategiaBaseSchema = z.object({
  tipo: z.string().min(3),
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

// Cuerpo completo del POST
const BodySchema = z.object({
  areaIds: z.array(z.string()).min(1, "Seleccione al menos un área/gerencia"),
  nombreProceso: z.string().min(2, "Ingrese el nombre del proceso crítico"),
  descripcionProceso: z.string().min(5, "Describa el proceso crítico"),
  estrategias: z
    .array(EstrategiaBaseSchema)
    .min(1, "Debe enviar al menos una estrategia"),
});

// Tipo de respuesta para la tabla
export type StrategyRow = {
  id: string;             // 👈 NUEVO
  proceso: string;
  descripcion: string;
  tipo: string;
  soluciones: string;
  recursos: string;
  responsabilidades: string;
  roles: string;
  estructura: string;
  actividades: string;
  frecuencias: string;
  resultados: string;
  monitoreo: string;
};

// ============ POST: crear las estrategias ============

export async function POST(req: Request) {
  const { session, response } = await requireApiSession();

  if (!session) return response;

  try {
    const raw = await req.json();
    const data = BodySchema.parse(raw);

    // 1) Validar áreas
    const areasDb = await prisma.area.findMany({
      where: { id: { in: data.areaIds } },
      select: { id: true },
    });

    const faltantes = data.areaIds.filter(
      (id) => !areasDb.some((a) => a.id === id),
    );

    if (faltantes.length) {
      return NextResponse.json(
        { error: `Áreas inexistentes: ${faltantes.join(", ")}` },
        { status: 400 },
      );
    }

    // 2) Transacción: crear una Estrategia por cada item en `estrategias`
    const creadas = await prisma.$transaction(async (tx) => {
      const createdEstrats = [];

      for (const e of data.estrategias) {
        const estrategia = await tx.estrategia.create({
          data: {
            nombreProceso: data.nombreProceso,
            descripcionProceso: data.descripcionProceso,
            tipo: e.tipo,
            soluciones: e.soluciones,
            recursos: e.recursos ?? "",
            responsabilidades: e.responsabilidades ?? "",
            roles: e.roles ?? "",
            estructura: e.estructura ?? "",
            actividades: e.actividades ?? "",
            frecuencias: e.frecuencias ?? "",
            resultados: e.resultados ?? "",
            monitoreo: e.monitoreo ?? "",
          },
        });

        await tx.estrategiaArea.createMany({
          data: data.areaIds.map((areaId) => ({
            estrategiaId: estrategia.id,
            areaId,
          })),
          skipDuplicates: true,
        });

        createdEstrats.push(estrategia);
      }

      return createdEstrats;
    });

    return NextResponse.json(
      {
        ok: true,
        count: creadas.length,
        ids: creadas.map((e) => e.id),
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("ERROR /api/estrategias (POST):", err);

    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error al guardar las estrategias" },
      { status: 500 },
    );
  }
}

// ============ GET: listar estrategias por areaId para la tabla ============

export async function GET(req: Request) {
  const { session, response } = await requireApiSession();

  if (!session) return response;

  const { searchParams } = new URL(req.url);
  const areaId = searchParams.get("areaId");

  if (!areaId) {
    return NextResponse.json(
      { error: "Falta parámetro areaId" },
      { status: 400 },
    );
  }

  try {
    const estrategias = await prisma.estrategia.findMany({
      where: {
        areas: {
          some: { areaId },
        },
      },
      select: {
        id: true,                    // 👈 NUEVO
        nombreProceso: true,
        descripcionProceso: true,
        tipo: true,
        soluciones: true,
        recursos: true,
        responsabilidades: true,
        roles: true,
        estructura: true,
        actividades: true,
        frecuencias: true,
        resultados: true,
        monitoreo: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const rows: StrategyRow[] = estrategias.map((e) => ({
      id: e.id,
      proceso: e.nombreProceso,
      descripcion: e.descripcionProceso,
      tipo: e.tipo,
      soluciones: e.soluciones,
      recursos: e.recursos,
      responsabilidades: e.responsabilidades,
      roles: e.roles,
      estructura: e.estructura,
      actividades: e.actividades,
      frecuencias: e.frecuencias,
      resultados: e.resultados,
      monitoreo: e.monitoreo,
    }));

    return NextResponse.json({ rows }, { status: 200 });
  } catch (err) {
    console.error("ERROR /api/estrategias (GET):", err);
    return NextResponse.json(
      { error: "Error al consultar estrategias" },
      { status: 500 },
    );
  }
}
