import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        const [
            totalAreas,
            totalSubAreas,
            totalProcesos,
            totalEstrategias,
            totalPlanes,
        ] = await Promise.all([
            prisma.area.count(),
            prisma.subArea.count(),
            prisma.procesoCritico.count(),
            prisma.estrategia.count(),
            prisma.plan.count(),
        ]);

        const procesosPorPrioridadRaw = await prisma.procesoCritico.groupBy({
            by: ["prioridad"],
            _count: { _all: true },
        });

        const procesosPorPrioridad = procesosPorPrioridadRaw.map((item) => ({
            prioridad: item.prioridad,
            count: item._count._all,
        }));

        const estrategiasPorTipoRaw = await prisma.estrategia.groupBy({
            by: ["tipo"],
            _count: { _all: true },
        });

        const estrategiasPorTipo = estrategiasPorTipoRaw.map((item) => ({
            tipo: item.tipo,
            count: item._count._all,
        }));

        return NextResponse.json({
            totalAreas,
            totalSubAreas,
            totalProcesos,
            totalEstrategias,
            totalPlanes,
            procesosPorPrioridad,
            estrategiasPorTipo,
        });
    } catch (err) {
        console.error("Error obteniendo stats:", err);
        return NextResponse.json(
            { error: "Error obteniendo estadísticas" },
            { status: 500 }
        );
    }
}
