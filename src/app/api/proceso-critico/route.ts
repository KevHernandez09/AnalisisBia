import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * VALIDACIÓN DEL BODY
 */
const BodySchema = z.object({
  departamentoId: z.string().min(1, "Seleccione un departamento"),
  subAreaIds: z.array(z.string()).min(1, "Seleccione al menos una subárea"),

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

  tiposImpacto: z.array(z.string()).min(1, "Seleccione al menos un tipo de impacto"),
  prioridad: z.enum(["Alta", "Media", "Baja"]),
});

/**
 * POST /api/proceso-critico
 */
export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const data = BodySchema.parse(raw);

    const prioridad = data.prioridad;

    // === Validar Departamento ===
    const departamento = await prisma.area.findUnique({
      where: { id: data.departamentoId },
      select: { id: true },
    });

    if (!departamento) {
      return NextResponse.json(
        { error: `Departamento inexistente: ${data.departamentoId}` },
        { status: 400 },
      );
    }

    // === Validar Subáreas ===
    const subAreasDb = await prisma.subArea.findMany({
      where: { id: { in: data.subAreaIds } },
      select: { id: true, label: true, areaId: true },
    });

    const faltantes = data.subAreaIds.filter(
      (sa) => !subAreasDb.some((x) => x.id === sa),
    );

    if (faltantes.length) {
      return NextResponse.json(
        { error: `Subáreas inexistentes: ${faltantes.join(", ")}` },
        { status: 400 },
      );
    }

    // === Validar Pertenencia al Departamento ===
    const invalidas = subAreasDb.filter(
      (sa) => sa.areaId !== data.departamentoId,
    );

    if (invalidas.length > 0) {
      return NextResponse.json(
        {
          error:
            "Subáreas que NO pertenecen al departamento seleccionado: " +
            invalidas.map((x) => x.label).join(", "),
        },
        { status: 400 },
      );
    }

    // === Validar Tipos de impacto ===
    const impactosDb = await prisma.impactType.findMany({
      where: { name: { in: data.tiposImpacto } },
      select: { id: true, name: true },
    });

    const tiposInvalidos = data.tiposImpacto.filter(
      (t) => !impactosDb.some((i) => i.name === t),
    );

    if (tiposInvalidos.length) {
      return NextResponse.json(
        { error: `Tipos de impacto inválidos: ${tiposInvalidos.join(", ")}` },
        { status: 400 },
      );
    }

    // === Crear Proceso ===
    const created = await prisma.$transaction(async (tx) => {
      const proc = await tx.procesoCritico.create({
        data: {
          nombre: data.nombre,
          descripcion: data.descripcion,
          entradas: data.entradas,
          salidas: data.salidas,
          partes: data.partes,
          sincronizacion: data.sincronizacion,
          rto: data.rto,
          mtpd: data.mtpd,
          rpo: data.rpo,
          recursos: data.recursos,
          requisitos: data.requisitos,
          descImpacto: data.descImpacto,
          prioridad,
        },
        select: { id: true },
      });

      // Subáreas
      await tx.procesoSubarea.createMany({
        data: data.subAreaIds.map((subId) => ({
          procesoId: proc.id,
          subareaId: subId,
        })),
        skipDuplicates: true,
      });

      // Tipos de impacto
      await tx.procesoImpact.createMany({
        data: impactosDb.map((i) => ({
          procesoId: proc.id,
          impactTypeId: i.id,
        })),
        skipDuplicates: true,
      });

      return proc;
    });

    return NextResponse.json(
      { ok: true, id: created.id },
      { status: 201 },
    );
  } catch (err: any) {
    if (err.name === "ZodError") {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error("ERROR:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
