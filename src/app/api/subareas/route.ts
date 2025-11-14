// src/app/api/subareas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const areaId = searchParams.get("areaId");

  const where = areaId ? { areaId } : {};

  const subareas = await prisma.subArea.findMany({
    where,
    orderBy: { label: "asc" },
  });

  return NextResponse.json(subareas, { status: 200 });
}
