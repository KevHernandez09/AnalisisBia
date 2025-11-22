import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireApiSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Tipos según el select
type ImpactRelation = { impactType: { name: string } };
type SubAreaRelation = { subarea: { label: string } };

type ProcesoCriticoRecord = {
  id: string;
  nombre: string;
  descripcion: string | null;
  entradas: string | null;
  salidas: string | null;
  partes: string | null;
  sincronizacion: string | null;
  rto: string | null;
  mtpd: string | null;
  rpo: string | null;
  recursos: string | null;
  requisitos: string | null;
  descImpacto: string | null;
  prioridad: string;
  subAreas: SubAreaRelation[];
  impactos: ImpactRelation[];
};

type Row = {
  id: string;   // 👈 importante para poder editar
  area: string;
  nombre: string;
  descripcion: string;
  entradas: string;
  salidas: string;
  partes: string;
  sincronizacion: string;
  rto: string;
  mtpd: string;
  rpo: string;
  recursos: string;
  requisitos: string;
  tipoImpacto: string;
  descImpacto: string;
  prioridad: string;
};

export async function GET(req: Request) {
  const { session, response } = await requireApiSession();

  if (!session) return response;

  const { searchParams } = new URL(req.url);
  const departamentoId = searchParams.get("departamentoId");

  if (!departamentoId) {
    return NextResponse.json(
      { error: "Falta departamentoId" },
      { status: 400 },
    );
  }

  try {
    const procesos = await prisma.procesoCritico.findMany({
      where: {
        // Procesos que tengan al menos una subárea cuyo Area.id = departamentoId
        subAreas: {
          some: {
            subarea: {
              areaId: departamentoId,
            },
          },
        },
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        entradas: true,
        salidas: true,
        partes: true,
        sincronizacion: true,
        rto: true,
        mtpd: true,
        rpo: true,
        recursos: true,
        requisitos: true,
        descImpacto: true,
        prioridad: true,
        subAreas: {
          select: {
            subarea: {
              select: { label: true },
            },
          },
        },
        impactos: {
          select: {
            impactType: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const rows: Row[] = procesos.map((p: ProcesoCriticoRecord) => {
      // Nombres de subáreas unidas por coma
      const areaLabel = p.subAreas.map((sa) => sa.subarea.label).join(", ");
      const tipoImpacto = p.impactos.map((i) => i.impactType.name).join(", ");

      return {
        id: p.id,
        area: areaLabel,
        nombre: p.nombre,
        descripcion: p.descripcion ?? "",
        entradas: p.entradas ?? "",
        salidas: p.salidas ?? "",
        partes: p.partes ?? "",
        sincronizacion: p.sincronizacion ?? "",
        rto: p.rto ?? "",
        mtpd: p.mtpd ?? "",
        rpo: p.rpo ?? "",
        recursos: p.recursos ?? "",
        requisitos: p.requisitos ?? "",
        tipoImpacto,
        descImpacto: p.descImpacto ?? "",
        prioridad: p.prioridad,
      };
    });

    return NextResponse.json({ rows }, { status: 200 });
  } catch (err) {
    console.error("Error /api/bia:", err);
    return NextResponse.json(
      { error: "Error al consultar BIA" },
      { status: 500 },
    );
  }
}
