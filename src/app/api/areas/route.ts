// src/app/api/areas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function GET() {
  const areas = await prisma.area.findMany({
    orderBy: { label: "asc" },
  });

  return NextResponse.json(areas, { status: 200 });
}
