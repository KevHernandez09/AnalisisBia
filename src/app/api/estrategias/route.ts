import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

// === Zod para el POST ===
const BodySchema = z.object({
  areaIds: z.array(z.string()).min(1, "Seleccione al menos un área/gerencia"),

  nombreProceso: z.string().min(2, "Ingrese el nombre del proceso crítico"),
  descripcionProceso: z.string().min(5, "Describa el proceso crítico"),

  tipo: z.string().min(1, "Tipo de estrategia requerido"), // "Estrategias de prevención", etc.

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

// ====== POST: crear estrategia ======
export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = BodySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // 1) Validar que las áreas existan
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

    // 2) Transacción: crear estrategia + join con áreas
    const created = await prisma.$transaction(async (tx) => {
      const estrategia = await tx.estrategia.create({
        data: {
          nombreProceso: data.nombreProceso,
          descripcionProceso: data.descripcionProceso,
          tipo: data.tipo,
          soluciones: data.soluciones,
          recursos: data.recursos ?? "",
          responsabilidades: data.responsabilidades ?? "",
          roles: data.roles ?? "",
          estructura: data.estructura ?? "",
          actividades: data.actividades ?? "",
          frecuencias: data.frecuencias ?? "",
          resultados: data.resultados ?? "",
          monitoreo: data.monitoreo ?? "",
        },
      });

      await tx.estrategiaArea.createMany({
        data: data.areaIds.map((areaId) => ({
          estrategiaId: estrategia.id,
          areaId,
        })),
        skipDuplicates: true,
      });

      return estrategia;
    });

    return NextResponse.json(
      { ok: true, id: created.id },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("ERROR /api/estrategias (POST):", err);

    if (err?.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error al guardar la estrategia" },
      { status: 500 },
    );
  }
}

// ====== GET: obtener estrategias por departamento (areaId) ======
type StrategyRow = {
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const areaId = searchParams.get("areaId");

  if (!areaId) {
    return NextResponse.json(
      { error: "Falta el parámetro areaId" },
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
      orderBy: { createdAt: "desc" },
    });

    const rows: StrategyRow[] = estrategias.map((e) => ({
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
